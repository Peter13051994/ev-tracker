import type { CarPrices } from "../types"

type Props = {
  carPrices: CarPrices
  setCarPrices: React.Dispatch<React.SetStateAction<CarPrices>>
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Settings({
  carPrices,
  setCarPrices,
  darkMode,
  setDarkMode,
}: Props) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Nastavenia</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-2">
        <h2 className="font-semibold">Ceny áut</h2>

        <label className="block">
          EV (€)
          <input
            type="number"
            value={carPrices.ev}
            onChange={e =>
              setCarPrices({
                ...carPrices,
                ev: Number(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          Benzín (€)
          <input
            type="number"
            value={carPrices.petrol}
            onChange={e =>
              setCarPrices({
                ...carPrices,
                petrol: Number(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          Nafta (€)
          <input
            type="number"
            value={carPrices.diesel}
            onChange={e =>
              setCarPrices({
                ...carPrices,
                diesel: Number(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
          />
        </label>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
        <span className="font-semibold">Dark mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={e => setDarkMode(e.target.checked)}
        />
      </div>
    </div>
  )
}
