import { useState } from "react"
import type { Trip, Charging, CarPrices } from "../types"
import PaybackChart from "../components/PaybackChart"
import PaybackTimeline from "../components/PaybackTimeline"
import { calculatePaybackDate } from "../lib/payback"

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

  const petrol = tripsIn.reduce(
    (s, t) => s + t.petrolCost,
    0
  )
  const diesel = tripsIn.reduce(
    (s, t) => s + t.dieselCost,
    0
  )
  const evReal = chargingsIn.reduce(
    (s, c) => s + c.price,
    0
  )

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
  const [months, setMonths] = useState(3)

  const avg = sumInPeriod(
    trips,
    chargings,
    monthsAgo(months)
  )

  const avgSavePetrol = avg.savePetrol / months
  const avgSaveDiesel = avg.saveDiesel / months

  const diffPetrol = carPrices.ev - carPrices.petrol
  const diffDiesel = carPrices.ev - carPrices.diesel

  const monthsPetrol =
    avgSavePetrol > 0
      ? diffPetrol / avgSavePetrol
      : Infinity

  const monthsDiesel =
    avgSaveDiesel > 0
      ? diffDiesel / avgSaveDiesel
      : Infinity

  // 🔥 BOD ZLOMU
  const paybackPetrol = calculatePaybackDate(
    trips,
    chargings,
    diffPetrol
  )

  const paybackDiesel = calculatePaybackDate(
    trips,
    chargings,
    diffDiesel
  )

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">
        Prehľad & návratnosť
      </h1>

      {/* Prepínač */}
      <div className="flex gap-2">
        {[3, 6, 12].map(m => (
          <button
            key={m}
            onClick={() => setMonths(m)}
            className={`px-3 py-1 rounded ${
              months === m
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            {m} mes.
          </button>
        ))}
      </div>

      {/* Priemery */}
      <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg space-y-1">
        <div>
          Priemerná úspora vs benzín:{" "}
          {avgSavePetrol.toFixed(2)} € / mes.
        </div>
        <div>
          Návratnosť vs benzín:{" "}
          {isFinite(monthsPetrol)
            ? `${monthsPetrol.toFixed(1)} mes.`
            : "nikdy"}
        </div>

        <hr />

        <div>
          Priemerná úspora vs nafta:{" "}
          {avgSaveDiesel.toFixed(2)} € / mes.
        </div>
        <div>
          Návratnosť vs nafta:{" "}
          {isFinite(monthsDiesel)
            ? `${monthsDiesel.toFixed(1)} mes.`
            : "nikdy"}
        </div>
      </div>

      {/* 📅 BOD ZLOMU */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-1">
        <div className="font-semibold">Bod zlomu</div>
        <div>
          Vs benzín:{" "}
          {paybackPetrol
            ? paybackPetrol
            : "zatiaľ nie"}
        </div>
        <div>
          Vs nafta:{" "}
          {paybackDiesel
            ? paybackDiesel
            : "zatiaľ nie"}
        </div>
      </div>

      <PaybackChart
        monthlySavePetrol={avgSavePetrol}
        monthlySaveDiesel={avgSaveDiesel}
        diffPetrol={diffPetrol}
        diffDiesel={diffDiesel}
      />

      <PaybackTimeline
        trips={trips}
        chargings={chargings}
        months={months}
      />
    </div>
  )
}
