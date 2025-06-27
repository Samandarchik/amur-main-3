"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Salad, Cookie, Beef, RibbonIcon as Rice } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    key: "shashlik",
    name: "Shashlik",
    icon: Beef,
    color: "bg-red-100 text-red-600",
    count: 12,
  },
  {
    key: "milliy_taomlar",
    name: "Milliy taomlar",
    icon: Rice,
    color: "bg-orange-100 text-orange-600",
    count: 8,
  },
  {
    key: "ichimliklar",
    name: "Ichimliklar",
    icon: Coffee,
    color: "bg-blue-100 text-blue-600",
    count: 15,
  },
  {
    key: "salat",
    name: "Salatlar",
    icon: Salad,
    color: "bg-green-100 text-green-600",
    count: 6,
  },
  {
    key: "shirinliklar",
    name: "Shirinliklar",
    icon: Cookie,
    color: "bg-purple-100 text-purple-600",
    count: 10,
  },
]

export function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriyalar</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bizning keng assortimentimizdan o'zingizga yoqqan taomni tanlang
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.key} href={`/menu?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} ta taom</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
