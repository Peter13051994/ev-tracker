import { useState } from "react"
import type { Charging } from "../types"
import { exportToCsv } from "../lib/exportCsv"

type Props = {
  chargings: Charging[]
  setChargings: React.Dispatch<React.SetStateAction<Charging[]>>
}

export default function Charging({
  chargings,
  setChargings,
}: Props) {
  const [date, setDate] = useState("")
  const [kwh, setKwh] = useState("")
  const [location, setLocation] =
    useState<Charging["location"]>("DOMA")

  const pricePerKwh = {
    DOMA: 0.12,
    PRACA: 0,
    VEREJNE: 0.45,
  }

  const addCharging = () => {
    if (!date || !kwh) return

    const price =
      Number(kwh) * pricePerKwh[location]

    setChargings(prev => [
      ...prev,
      {
        id: Date.now(),
        date,
        kwh: Number(kwh),
        location,
        price,
      },
    ])

    setDate("")
    setKwh("")
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Nabíjanie</h1>

        <button
          onClick={() =>
            exportToCsv("nabijania.csv", chargings)
          }
          className="bg-gray-600 text-white px-3 py-1 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-2">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="kWh"
          value={kwh}
          onChange={e => setKwh(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={location}
          onChange={e =>
            setLocation(
              e.target.value as Charging["location"]
            )
          }
          className="w-full border p-2 rounded"
        >
          <option value="DOMA">Doma</option>
          <option value="PRACA">Práca</option>
          <option value="VEREJNE">Verejne</option>
        </select>

        <button
          onClick={addCharging}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          + Pridať nabíjanie
        </button>
      </div>

      <ul className="space-y-2 mt-4">
        {chargings.map(c => (
          <li
            key={c.id}
            className="bg-white p-3 rounded-lg shadow flex justify-between"
          >
            <div>
              <div className="font-semibold">{c.date}</div>
              <div className="text-sm text-gray-500">
                {c.location}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold">{c.kwh} kWh</div>
              <div className="text-sm text-green-600">
                {c.price.toFixed(2)} €
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
