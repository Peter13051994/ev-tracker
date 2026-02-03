import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import type { Car } from "../types"

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  // form state
  const [name, setName] = useState("")
  const [type, setType] = useState<Car["type"]>("EV")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [consumption, setConsumption] = useState("")

  // LOAD CARS
  useEffect(() => {
    const loadCars = async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("id")

      if (error) {
        console.error(error)
      } else if (data) {
        setCars(
          data.map(row => ({
            id: row.id,
            name: row.name,
            type: row.type,
            purchasePrice: row.purchase_price,
            consumption: row.consumption,
            active: row.active,
          }))
        )
      }

      setLoading(false)
    }

    loadCars()
  }, [])

  // ADD CAR
  const addCar = async () => {
    if (!name || !purchasePrice || !consumption) return

    const { data, error } = await supabase
      .from("cars")
      .insert({
        name,
        type,
        purchase_price: Number(purchasePrice),
        consumption: Number(consumption),
        active: cars.length === 0, // prvé auto aktívne
      })
      .select()
      .single()

    if (error) {
      alert("Chyba pri ukladaní auta")
      console.error(error)
      return
    }

    if (data) {
      setCars(prev => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          type: data.type,
          purchasePrice: data.purchase_price,
          consumption: data.consumption,
          active: data.active,
        },
      ])

      // reset form
      setName("")
      setType("EV")
      setPurchasePrice("")
      setConsumption("")
    }
  }

  if (loading) {
    return <div className="p-4">Načítavam autá…</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Autá</h1>

      {/* FORM */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-2">
        <h2 className="font-semibold">Pridať auto</h2>

        <input
          placeholder="Názov auta (napr. Leapmotor C10)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={type}
          onChange={e =>
            setType(e.target.value as Car["type"])
          }
          className="w-full border p-2 rounded"
        >
          <option value="EV">EV</option>
          <option value="PETROL">Benzín</option>
          <option value="DIESEL">Nafta</option>
        </select>

        <input
          type="number"
          placeholder="Cena auta (€)"
          value={purchasePrice}
          onChange={e => setPurchasePrice(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Spotreba (kWh/100 km)"
          value={consumption}
          onChange={e => setConsumption(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={addCar}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          + Pridať auto
        </button>
      </div>

      {/* LIST */}
      {cars.length === 0 && (
        <div className="text-gray-500">
          Zatiaľ nemáš pridané žiadne auto.
        </div>
      )}

      <ul className="space-y-2">
        {cars.map(car => (
          <li
            key={car.id}
            className={`p-3 rounded-lg shadow ${
              car.active
                ? "bg-green-100 dark:bg-green-900"
                : "bg-white dark:bg-gray-800"
            }`}
          >
            <div className="font-semibold">
              {car.name} ({car.type})
            </div>
            <div className="text-sm text-gray-500">
              Cena: {car.purchasePrice} € · Spotreba:{" "}
              {car.consumption}
            </div>
            {car.active && (
              <div className="text-sm text-green-700 dark:text-green-300">
                Aktívne auto
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
