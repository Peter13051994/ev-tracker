import type { Trip, Charging } from "../types"

export function calculatePaybackDate(
  trips: Trip[],
  chargings: Charging[],
  priceDiff: number
): string | null {
  // všetky dátumy
  const dates = Array.from(
    new Set([
      ...trips.map(t => t.date),
      ...chargings.map(c => c.date),
    ])
  ).sort()

  let cumPetrol = 0
  let cumDiesel = 0
  let cumEv = 0

  for (const date of dates) {
    trips
      .filter(t => t.date === date)
      .forEach(t => {
        cumPetrol += t.petrolCost
        cumDiesel += t.dieselCost
      })

    chargings
      .filter(c => c.date === date)
      .forEach(c => {
        cumEv += c.price
      })

    const saveVsPetrol = cumPetrol - cumEv
    const saveVsDiesel = cumDiesel - cumEv

    if (priceDiff <= saveVsPetrol || priceDiff <= saveVsDiesel) {
      return date
    }
  }

  return null
}
