import { useState } from "react"
import type { Trip } from "../types"
import TripForm from "../components/TripForm"
import { exportToCsv } from "../lib/exportCsv"

type Props = {
  trips: Trip[]
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>
}

export default function Trips({ trips, setTrips }: Props) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Jazdy</h1>

        <div className="flex gap-2">
          <button
            onClick={() => exportToCsv("jazdy.csv", trips)}
            className="bg-gray-600 text-white px-3 py-1 rounded-lg"
          >
            Export CSV
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg"
          >
            + Pridať
          </button>
        </div>
      </div>

      {showForm && (
        <TripForm
          onSave={trip => {
            setTrips(prev => [...prev, trip])
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ul className="space-y-2 mt-4">
        {trips.map(trip => (
          <li
            key={trip.id}
            className="bg-white p-3 rounded-lg shadow flex justify-between"
          >
            <div>
              <div className="font-semibold">{trip.date}</div>
              <div className="text-sm text-gray-500">
                {trip.type}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold">
                {trip.distance} km
              </div>
              <div className="text-sm text-green-600">
                ⚡ {trip.evCost.toFixed(2)} €
              </div>
              <div className="text-sm text-gray-500">
                ⛽ {trip.petrolCost.toFixed(2)} € | 🛢️{" "}
                {trip.dieselCost.toFixed(2)} €
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
