import type { CarPrices } from "../types"
import type { Dispatch, SetStateAction } from "react"

type Props = {
  carPrices: CarPrices
  setCarPrices: Dispatch<SetStateAction<CarPrices>>
}

export default function Settings({ carPrices, setCarPrices }: Props) {
  const update = (key: keyof CarPrices, value: string) => {
    setCarPrices(prev => ({
      ...prev,
      [key]: Number(value),
    }))
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Nastavenia – ceny áut</h1>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <input
          type="number"
          value={carPrices.ev}
          onChange={e => update("ev", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Cena EV"
        />

        <input
          type="number"
          value={carPrices.petrol}
          onChange={e => update("petrol", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Cena benzín"
        />

        <input
          type="number"
          value={carPrices.diesel}
          onChange={e => update("diesel", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Cena nafta"
        />
      </div>
    </div>
  )
}
