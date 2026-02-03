import { serve } from "https://deno.land/std@0.203.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (!supabaseUrl || !serviceKey) {
      throw new Error("Missing env vars")
    }

    const supabase = createClient(supabaseUrl, serviceKey)

    const csvUrl =
      "https://data.statistics.sk/api/v2/dataset/sp0207ts/all/UKAZ01,UKAZ021,UKAZ04,UKAZ041?lang=sk&type=csv&format=2"

    const res = await fetch(csvUrl)
    if (!res.ok) throw new Error("Statistics CSV not reachable")

    let text = await res.text()
    text = text.replace(/^\uFEFF/, "")

    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)

    lines.shift() // header

    type Row = { week: string; code: string; value: number }
    const rows: Row[] = []

    for (const line of lines) {
      const cols = line
        .split(";")
        .map(c => c.replaceAll('"', "").trim())

      if (cols.length < 3) continue

      const week = cols[0]   // RRRRTT
      const code = cols[1]   // UKAZ
      const rawValue = cols[cols.length - 1] // 👈 POSLEDNÝ STĹPEC

      if (!rawValue) continue // budúce týždne

      const value = Number(rawValue.replace(",", "."))

      if (!week || !code || isNaN(value)) continue

      rows.push({ week, code, value })
    }

    if (!rows.length) {
      throw new Error("No valid price rows found")
    }

    const lastWeek = [...new Set(rows.map(r => r.week))].sort().pop()!
    const period = `${lastWeek.slice(0, 4)}-W${lastWeek.slice(4)}`

    const price = (code: string) =>
      rows.find(r => r.week === lastWeek && r.code === code)?.value

    const petrol95 = price("UKAZ01")
    const petrol100 = price("UKAZ021")
    const diesel = price("UKAZ04")
    const dieselPremium = price("UKAZ041")

    if (
      petrol95 == null ||
      petrol100 == null ||
      diesel == null ||
      dieselPremium == null
    ) {
      throw new Error("Incomplete fuel prices for latest completed week")
    }

    const { data: exists } = await supabase
      .from("fuel_prices")
      .select("id")
      .eq("period", period)
      .maybeSingle()

    if (exists) {
      return response({ status: "exists", period })
    }

    const { error } = await supabase.from("fuel_prices").insert({
      period,
      petrol_95: petrol95,
      petrol_100: petrol100,
      diesel,
      diesel_premium: dieselPremium,
    })

    if (error) throw error

    return response({
      status: "inserted",
      period,
      petrol_95: petrol95,
      petrol_100: petrol100,
      diesel,
      diesel_premium: dieselPremium,
    })
 } catch (e) {
  console.error(e)

  return response(
    {
      error:
        e instanceof Error
          ? e.message
          : JSON.stringify(e),
    },
    500
  )
}

})

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
