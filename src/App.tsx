import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import Dashboard from "./pages/Dashboard"
import Trips from "./pages/Trips"
import Charging from "./pages/Charging"
import Settings from "./pages/Settings"
import BottomNav from "./components/BottomNav"
import type {
  Trip,
  Charging as ChargingType,
  CarPrices,
} from "./types"
import { supabase } from "./lib/supabase"

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [chargings, setChargings] = useState<ChargingType[]>([])
  const [carPrices, setCarPrices] = useState<CarPrices>({
    ev: 42990,
    petrol: 19000,
    diesel: 9200,
  })
  const [darkMode, setDarkMode] = useState(false)

  // ===== APPLY DARK MODE TO <html> =====
  useEffect(() => {
    const html = document.documentElement
    if (darkMode) html.classList.add("dark")
    else html.classList.remove("dark")
  }, [darkMode])

  // ===== LOAD =====
  useEffect(() => {
    const load = async () => {
      const { data: tripsData } = await supabase
        .from("trips")
        .select("*")

      const { data: chargingsData } = await supabase
        .from("chargings")
        .select("*")

      const { data: settingsData } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single()

      if (tripsData) {
        setTrips(
          tripsData.map(row => ({
            id: row.id,
            date: row.date,
            distance: row.distance,
            type: row.type,
            evCost: row.ev_cost,
            petrolCost: row.petrol_cost,
            dieselCost: row.diesel_cost,
          }))
        )
      }

      if (chargingsData) setChargings(chargingsData)

      if (settingsData) {
        setCarPrices({
          ev: settingsData.ev,
          petrol: settingsData.petrol,
          diesel: settingsData.diesel,
        })
        setDarkMode(settingsData.darkMode)
      }
    }

    load()
  }, [])

  // ===== SAVE =====
  useEffect(() => {
    if (trips.length)
      supabase.from("trips").upsert(
        trips.map(t => ({
          id: t.id,
          date: t.date,
          distance: t.distance,
          type: t.type,
          ev_cost: t.evCost,
          petrol_cost: t.petrolCost,
          diesel_cost: t.dieselCost,
        }))
      )
  }, [trips])

  useEffect(() => {
    if (chargings.length)
      supabase.from("chargings").upsert(chargings)
  }, [chargings])

  useEffect(() => {
    supabase.from("settings").upsert({
      id: 1,
      ...carPrices,
      darkMode,
    })
  }, [carPrices, darkMode])

  return (
    <BrowserRouter>
      <div className="pb-16 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                trips={trips}
                chargings={chargings}
                carPrices={carPrices}
              />
            }
          />
          <Route
            path="/trips"
            element={<Trips trips={trips} setTrips={setTrips} />}
          />
          <Route
            path="/charging"
            element={
              <Charging
                chargings={chargings}
                setChargings={setChargings}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                carPrices={carPrices}
                setCarPrices={setCarPrices}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
