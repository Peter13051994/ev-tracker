import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type Props = {
  monthlySavePetrol: number
  monthlySaveDiesel: number
  diffPetrol: number
  diffDiesel: number
}

export default function PaybackChart({
  monthlySavePetrol,
  monthlySaveDiesel,
  diffPetrol,
  diffDiesel,
}: Props) {
  const months = 240 // 20 rokov

  const data = Array.from({ length: months }, (_, i) => {
    const month = i + 1
    return {
      month,
      petrol:
        monthlySavePetrol * month - diffPetrol,
      diesel:
        monthlySaveDiesel * month - diffDiesel,
    }
  })

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Návratnosť v čase</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="petrol"
            stroke="#16a34a"
            strokeWidth={2}
            name="vs Benzín"
          />
          <Line
            type="monotone"
            dataKey="diesel"
            stroke="#2563eb"
            strokeWidth={2}
            name="vs Nafta"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
