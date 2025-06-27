
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, Shield, Truck, Users } from "lucide-react"
import { useLanguage } from "@/hooks/use-language" // Assuming your useLanguage hook is in this path


export function AboutSection() {
  const {t} = useLanguage()
const features = [
  {
    icon: Clock,
    titleKey: "about.feature.fastDeliveryTitle",
    descriptionKey: "about.feature.fastDeliveryDesc",
  },
  {
    icon: Shield,
    titleKey: "about.feature.qualityGuaranteeTitle",
    descriptionKey: "about.feature.qualityGuaranteeDesc",
  },
  {
    icon: Truck,
    titleKey: "about.feature.deliveryTitle",
    descriptionKey: "about.feature.deliveryDesc",
  },
  {
    icon: Users,
    titleKey: "about.feature.supportTitle",
    descriptionKey: "about.feature.supportDesc",
  },
]


  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.one')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
          {t("about.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-gray-600 text-sm">{t(feature.descriptionKey)}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}