import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import Dashboard from "./pages/Dashboard"
import Trips from "./pages/Trips"
import Charging from "./pages/Charging"
import Settings from "./pages/Settings"
import Cars from "./pages/Cars"
import BottomNav from "./components/BottomNav"
import type { Trip, Charging as ChargingType, CarPrices } from "./types"
import { supabase } from "./lib/supabase"

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [chargings, setChargings] = useState<ChargingType[]>([])
  const [carPrices, setCarPrices] = useState<CarPrices>({
    ev: 0,
    petrol: 0,
    diesel: 0,
  })
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    darkMode
      ? html.classList.add("dark")
      : html.classList.remove("dark")
  }, [darkMode])

  useEffect(() => {
    const load = async () => {
      const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single()

      if (settings) setDarkMode(settings.darkMode)
    }
    load()
  }, [])

  return (
    <BrowserRouter>
      <div className="pb-16 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Dashboard trips={trips} chargings={chargings} carPrices={carPrices} />} />
          <Route path="/trips" element={<Trips trips={trips} setTrips={setTrips} />} />
          <Route path="/charging" element={<Charging chargings={chargings} setChargings={setChargings} />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/settings" element={<Settings carPrices={carPrices} setCarPrices={setCarPrices} darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
