

"use client"

import { useState, useEffect } from "react" // Added for consistency, though not strictly used in static content here
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, MapPin, Phone, Truck } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language" // Import useLanguage hook

export default function DastafkaPage() {
  const { t } = useLanguage() // Initialize translation hook

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("delivery.service_title")}</h1>
            <p className="text-gray-600 text-lg">{t("delivery.service_subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="animate-fade-in-up animation-delay-200">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700 flex items-center gap-2">
                  <Truck className="h-6 w-6" />
                  {t("delivery.delivery_service_card_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  {t("delivery.delivery_service_description")}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• {t("delivery.feature_fast_delivery")}</li>
                  <li>• {t("delivery.feature_area_coverage")}</li>
                  <li>• {t("delivery.feature_hot_delivery")}</li>
                  <li>• {t("delivery.feature_safe_packaging")}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-400">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700">{t("delivery.contact_info_title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>+ 998 94 700 07 70</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{t("delivery.address_location")}</span> {/* Translated address */}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>{t("contact.hours")}</span> {/* Reusing existing contact.hours key */}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild className="transform hover:scale-105 transition-all duration-200">
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                {t("common.back_to_homepage")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
