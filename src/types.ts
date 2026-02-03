export type Trip = {
  id: number
  date: string
  distance: number
  type: string
  evCost: number
  petrolCost: number
  dieselCost: number
}

export type Charging = {
  id: number
  date: string
  kwh: number
  location: "DOMA" | "PRACA" | "VEREJNE"
  price: number
}

export type CarPrices = {
  ev: number
  petrol: number
  diesel: number
}

export type Settings = {
  id: number
  darkMode: boolean
}
