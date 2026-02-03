import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { Trip, Charging } from "../types"

type Props = {
  trips: Trip[]
  chargings: Charging[]
  months: number
}

function monthsAgo(n: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

export default function PaybackTimeline({
  trips,
  chargings,
  months,
}: Props) {
  const from = monthsAgo(months)

  const tripsIn = trips.filter(
    t => new Date(t.date) >= from
  )
  const chargingsIn = chargings.filter(
    c => new Date(c.date) >= from
  )

  // zoradíme chronologicky
  const dates = Array.from(
    new Set([
      ...tripsIn.map(t => t.date),
      ...chargingsIn.map(c => c.date),
    ])
  ).sort()

  let cumPetrol = 0
  let cumDiesel = 0
  let cumEv = 0

  const data = dates.map(date => {
    tripsIn
      .filter(t => t.date === date)
      .forEach(t => {
        cumPetrol += t.petrolCost
        cumDiesel += t.dieselCost
      })

    chargingsIn
      .filter(c => c.date === date)
      .forEach(c => {
        cumEv += c.price
      })

    return {
      date,
      vsPetrol: cumPetrol - cumEv,
      vsDiesel: cumDiesel - cumEv,
    }
  })

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">
        Kumulatívna úspora (posledných {months} mes.)
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="vsPetrol"
            stroke="#22c55e"
            name="Úspora vs benzín"
          />
          <Line
            type="monotone"
            dataKey="vsDiesel"
            stroke="#3b82f6"
            name="Úspora vs nafta"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
