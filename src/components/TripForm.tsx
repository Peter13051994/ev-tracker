import { useState } from "react"
import type { Trip } from "../types"

type Props = {
  onSave: (trip: Trip) => void
  onCancel: () => void
}

export default function TripForm({ onSave, onCancel }: Props) {
  const [date, setDate] = useState("")
  const [distance, setDistance] = useState("")
  const [type, setType] = useState("MIX")

  const save = () => {
    if (!date || !distance) return

    const km = Number(distance)

    const evCost = (km * 20.9) / 100 * 0.12
    const petrolCost = (km * 6.9) / 100 * 1.75
    const dieselCost = (km * 8) / 100 * 1.6

    onSave({
      id: Date.now(),
      date,
      distance: km,
      type,
      evCost,
      petrolCost,
      dieselCost,
    })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Vzdialenosť (km)"
        value={distance}
        onChange={e => setDistance(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="MIX">Mix</option>
        <option value="MESTO">Mesto</option>
        <option value="DIALNICA">Diaľnica</option>
      </select>

      <div className="flex gap-2 pt-2">
        <button
          onClick={save}
          className="bg-blue-600 text-white flex-1 py-2 rounded"
        >
          Uložiť
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-300 flex-1 py-2 rounded"
        >
          Zrušiť
        </button>
      </div>
    </div>
  )
}
