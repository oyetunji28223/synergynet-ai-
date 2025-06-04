"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "CyberSec",
    views: 143000,
    subscribers: 12000,
  },
  {
    name: "DevHacks",
    views: 192000,
    subscribers: 18000,
  },
  {
    name: "NetSec",
    views: 124000,
    subscribers: 10000,
  },
  {
    name: "CodeBreak",
    views: 210000,
    subscribers: 23000,
  },
  {
    name: "HackLab",
    views: 215000,
    subscribers: 22200,
  },
]

export function ChannelStats() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <Bar dataKey="views" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Bar dataKey="subscribers" fill="#2563eb" radius={[4, 4, 0, 0]} className="fill-blue-500" />
      </BarChart>
    </ResponsiveContainer>
  )
}
