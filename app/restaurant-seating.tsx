"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MapPin, Phone } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

const seatingAreas = [
  {
    id: "zal_1",
    name: "seating.zal1.name",
    description: "seating.zal1.description",
    capacity: "seating.zal1.capacity",
    features: ["seating.features.ac", "seating.features.wifi", "seating.features.music"],
    imageUrl:
      "/zal1.jpg",
    rating: 4.7,
    reviewCount: 23,
    isPopular: true,
    priceRange: "seating.free",
  },
  {
    id: "zal_2",
    name: "seating.zal2.name",
    description: "seating.zal2.description",
    capacity: "seating.zal2.capacity",
    features: ["seating.features.projector", "seating.features.ac", "seating.features.special"],
    imageUrl:
      "/zal1.jpg",
    rating: 4.5,
    reviewCount: 18,
    isPopular: false,
    priceRange: "seating.free",
  },
  {
    id: "terassa",
    name: "seating.terrace.name",
    description: "seating.terrace.description",
    capacity: "seating.terrace.capacity",
    features: ["seating.features.outdoor", "seating.features.view", "seating.features.bbq"],
    imageUrl:
      "/zal1.jpg",
    rating: 4.8,
    reviewCount: 31,
    isPopular: true,
    priceRange: "seating.free",
  },
  {
    id: "vip",
    name: "seating.vip.name",
    description: "seating.vip.description",
    capacity: "seating.vip.capacity",
    features: ["seating.features.private", "seating.features.premium", "seating.features.menu"],
    imageUrl:
      "/zal1.jpg",
    rating: 4.9,
    reviewCount: 12,
    isPopular: false,
    priceRange: "seating.free",
  },
]

export function RestaurantSeating() {
  const { t } = useLanguage()

  const handleBooking = (areaId: string, areaName: string) => {
    console.log(`Booking ${areaName} with ID: ${areaId}`)
    alert(`${areaName} ${t("seating.bookingAlert")}`)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("seating.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("seating.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seatingAreas.map((area) => (
            <Card key={area.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={area.imageUrl || "/placeholder.svg"}
                  alt={t(area.name)}
                  className="w-full h-48 object-cover"
                />
                {area.isPopular && (
                  <Badge className="absolute top-2 left-2 bg-orange-500">{t("seating.popular")}</Badge>
                )}
                {area.priceRange !== "seating.free" && (
                  <Badge className="absolute top-2 right-2 bg-blue-500">{t("seating.premium")}</Badge>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {t(area.capacity)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {area.rating} ({area.reviewCount})
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">{t(area.name)}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{t(area.description)}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {area.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {t(feature)}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{t(area.priceRange)}</span>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600 font-medium">{t("seating.booking")}</div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Phone Button */}
                    <div
                      className="flex items-center gap-2 text-white px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 flex-1 justify-center"
                      style={{ backgroundColor: "#101827" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f172a")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#101827")}
                      onClick={() => (window.location.href = "tel:+998947000770")}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">{t("seating.call")}</span>
                    </div>

                    {/* Telegram Button */}
                    <div
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 flex-1 justify-center"
                      onClick={() => window.open("https://t.me/amur_restoran_bot?start=joy_bron", "_blank")}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      <span className="text-sm font-medium">{t("seating.telegram")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
