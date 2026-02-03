import { useState } from "react"

type Props = {
  onSave: (trip: {
    id: number
    date: string
    distance: number
    type: string
  }) => void
  onCancel: () => void
}

export default function TripForm({ onSave, onCancel }: Props) {
  const [date, setDate] = useState("")
  const [distance, setDistance] = useState("")
  const [type, setType] = useState("Mesto")

  const submit = () => {
    if (!date || !distance) return

    onSave({
      id: Date.now(),
      date,
      distance: Number(distance),
      type,
    })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="space-y-3">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          placeholder="Počet km"
          value={distance}
          onChange={e => setDistance(e.target.value)}
          className="w-full border rounded p-2"
        />

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option>Mesto</option>
          <option>Okresky</option>
          <option>Diaľnica</option>
          <option>Mix</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={submit}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            Uložiť
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 py-2 rounded"
          >
            Zrušiť
          </button>
        </div>
      </div>
    </div>
  )
}
