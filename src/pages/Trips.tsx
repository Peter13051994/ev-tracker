import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Trip } from "../types"
import TripForm from "./TripForm"
import { evCost, petrolCost, dieselCost } from "../lib/calculations"

type Props = {
  trips: Trip[]
  setTrips: Dispatch<SetStateAction<Trip[]>>
}

export default function Trips({ trips, setTrips }: Props) {
  const [showForm, setShowForm] = useState(false)

  const addTrip = (
    trip: Omit<Trip, "evCost" | "petrolCost" | "dieselCost">
  ) => {
    const fullTrip: Trip = {
      ...trip,
      evCost: evCost(trip.distance),
      petrolCost: petrolCost(trip.distance),
      dieselCost: dieselCost(trip.distance),
    }

    setTrips(prev => [...prev, fullTrip])
    setShowForm(false)
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Jazdy</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg"
        >
          + Pridať
        </button>
      </div>

      {/* Formulár */}
      {showForm && (
        <TripForm onSave={addTrip} onCancel={() => setShowForm(false)} />
      )}

      {/* Zoznam jázd */}
      <ul className="space-y-2 mt-4">
        {trips.map(trip => (
          <li
            key={trip.id}
            className="bg-white p-3 rounded-lg shadow flex justify-between"
          >
            <div>
              <div className="font-semibold">{trip.date}</div>
              <div className="text-sm text-gray-500">{trip.type}</div>
            </div>

            <div className="text-right">
              <div className="font-bold">{trip.distance} km</div>
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
