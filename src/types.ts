export type Car = {
  id: number
  name: string
  type: "EV" | "PETROL" | "DIESEL"
  purchasePrice: number
  consumption: number
  active: boolean
}

export type Trip = {
  id: number
  date: string
  distance: number
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
