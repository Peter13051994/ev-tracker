import type { Trip, Charging, CarPrices } from "../types"
import PaybackChart from "../components/PaybackChart"

type Props = {
  trips: Trip[]
  chargings: Charging[]
  carPrices: CarPrices
}

function monthsAgo(n: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

function sumInPeriod(
  trips: Trip[],
  chargings: Charging[],
  from: Date
) {
  const tripsIn = trips.filter(t => new Date(t.date) >= from)
  const chargingsIn = chargings.filter(
    c => new Date(c.date) >= from
  )

  const petrol = tripsIn.reduce((s, t) => s + t.petrolCost, 0)
  const diesel = tripsIn.reduce((s, t) => s + t.dieselCost, 0)
  const evReal = chargingsIn.reduce((s, c) => s + c.price, 0)

  return {
    savePetrol: petrol - evReal,
    saveDiesel: diesel - evReal,
  }
}

export default function Dashboard({
  trips,
  chargings,
  carPrices,
}: Props) {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  const monthlyTrips = trips.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === month && d.getFullYear() === year
  })

  const monthlyChargings = chargings.filter(c => {
    const d = new Date(c.date)
    return d.getMonth() === month && d.getFullYear() === year
  })

  const evRealMonth = monthlyChargings.reduce(
    (s, c) => s + c.price,
    0
  )
  const petrolMonth = monthlyTrips.reduce(
    (s, t) => s + t.petrolCost,
    0
  )
  const dieselMonth = monthlyTrips.reduce(
    (s, t) => s + t.dieselCost,
    0
  )

  const avg3 = sumInPeriod(trips, chargings, monthsAgo(3))
  const avgSavePetrol3 = avg3.savePetrol / 3
  const avgSaveDiesel3 = avg3.saveDiesel / 3

  const diffPetrol = carPrices.ev - carPrices.petrol
  const diffDiesel = carPrices.ev - carPrices.diesel

  const monthsPetrolAvg =
    avgSavePetrol3 > 0
      ? diffPetrol / avgSavePetrol3
      : Infinity
  const monthsDieselAvg =
    avgSaveDiesel3 > 0
      ? diffDiesel / avgSaveDiesel3
      : Infinity

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Návratnosť EV</h1>

      <div className="bg-white p-4 rounded-lg shadow space-y-1">
        <div className="font-semibold">Aktuálny mesiac</div>
        <div>⚡ EV reálne: {evRealMonth.toFixed(2)} €</div>
        <div>⛽ Benzín: {petrolMonth.toFixed(2)} €</div>
        <div>🛢️ Nafta: {dieselMonth.toFixed(2)} €</div>
      </div>

      <div className="bg-green-100 p-4 rounded-lg space-y-1">
        <div className="font-semibold">
          Priemer za posledné 3 mesiace
        </div>
        <div>
          Úspora vs benzín: {avgSavePetrol3.toFixed(2)} € / mesiac
        </div>
        <div>
          Návratnosť vs benzín:{" "}
          {isFinite(monthsPetrolAvg)
            ? `${monthsPetrolAvg.toFixed(1)} mesiacov`
            : "nikdy"}
        </div>

        <hr />

        <div>
          Úspora vs nafta: {avgSaveDiesel3.toFixed(2)} € / mesiac
        </div>
        <div>
          Návratnosť vs nafta:{" "}
          {isFinite(monthsDieselAvg)
            ? `${monthsDieselAvg.toFixed(1)} mesiacov`
            : "nikdy"}
        </div>
      </div>

      <PaybackChart
        monthlySavePetrol={avgSavePetrol3}
        monthlySaveDiesel={avgSaveDiesel3}
        diffPetrol={diffPetrol}
        diffDiesel={diffDiesel}
      />
    </div>
  )
}
