import { useState } from "react"
import type { Charging } from "../types"
import type { Dispatch, SetStateAction } from "react"

type Props = {
  chargings: Charging[]
  setChargings: Dispatch<SetStateAction<Charging[]>>
}

const HOME_ELECTRICITY_PRICE = 0.15

export default function Charging({ chargings, setChargings }: Props) {
  const [date, setDate] = useState("")
  const [kwh, setKwh] = useState("")
  const [location, setLocation] = useState<Charging["location"]>("DOMA")
  const [price, setPrice] = useState("")

  const addCharging = () => {
    if (!date || !kwh) return

    let finalPrice = 0

    if (location === "DOMA") {
      finalPrice = Number(kwh) * HOME_ELECTRICITY_PRICE
    }

    if (location === "VEREJNE") {
      finalPrice = Number(price || 0)
    }

    const charging: Charging = {
      id: Date.now(),
      date,
      kwh: Number(kwh),
      location,
      price: finalPrice,
    }

    setChargings(prev => [...prev, charging])

    setDate("")
    setKwh("")
    setPrice("")
    setLocation("DOMA")
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Nabíjanie</h1>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          placeholder="kWh"
          value={kwh}
          onChange={e => setKwh(e.target.value)}
          className="w-full border rounded p-2"
        />

        <select
          value={location}
          onChange={e =>
            setLocation(e.target.value as Charging["location"])
          }
          className="w-full border rounded p-2"
        >
          <option value="DOMA">🏠 Doma</option>
          <option value="PRACA">🏢 Práca (zadarmo)</option>
          <option value="VEREJNE">⚡ Verejné</option>
        </select>

        {location === "VEREJNE" && (
          <input
            type="number"
            placeholder="Cena (€)"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full border rounded p-2"
          />
        )}

        <button
          onClick={addCharging}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Pridať nabíjanie
        </button>
      </div>

      <ul className="space-y-2">
        {chargings.map(c => (
          <li
            key={c.id}
            className="bg-white p-3 rounded-lg shadow flex justify-between"
          >
            <div>
              <div className="font-semibold">{c.date}</div>
              <div className="text-sm text-gray-500">
                {c.location} · {c.kwh} kWh
              </div>
            </div>
            <div className="font-bold">{c.price.toFixed(2)} €</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
