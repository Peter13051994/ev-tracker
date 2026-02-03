// Spotreby (zatiaľ natvrdo)
export const EV_CONSUMPTION = 20.9        // kWh / 100 km
export const PETROL_CONSUMPTION = 6.9     // l / 100 km
export const DIESEL_CONSUMPTION = 8.0     // l / 100 km

// Ceny (dočasné – neskôr z Nastavení)
export const ELECTRICITY_PRICE = 0.15     // €/kWh – DOČASNE
export const PETROL_PRICE = 1.70          // €/l
export const DIESEL_PRICE = 1.60          // €/l

export function evCost(distance: number) {
  return (distance / 100) * EV_CONSUMPTION * ELECTRICITY_PRICE
}

export function petrolCost(distance: number) {
  return (distance / 100) * PETROL_CONSUMPTION * PETROL_PRICE
}

export function dieselCost(distance: number) {
  return (distance / 100) * DIESEL_CONSUMPTION * DIESEL_PRICE
}
