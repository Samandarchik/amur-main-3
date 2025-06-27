
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api, type RestaurantTable } from "@/lib/api"
import { useLanguage } from "@/hooks/use-language" // Import useLanguage hook

export default function TablePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage() // Use the translation hook
  const [table, setTable] = useState<RestaurantTable | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTable = async () => {
      try {
        setIsLoading(true)
        const tables = await api.getRestaurantTables()
        const foundTable = tables.find((t) => t.id === params.id)

        if (foundTable) {
          setTable(foundTable)
          // Store table ID for checkout
          localStorage.setItem("selected_table_id", foundTable.id)
          localStorage.setItem("delivery_type", "atTheRestaurant")
          localStorage.setItem("table_info", JSON.stringify(foundTable)) // Store full table info
        } else {
          toast({
            title: t("table_not_found_title"), // "Stol topilmadi"
            description: t("table_not_found_description"), // "Kiritilgan stol ID si mavjud emas"
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Failed to load table:", error)
        toast({
          title: t("error_occurred_title"), // "Xatolik yuz berdi"
          description: t("table_data_load_error"), // "Stol ma'lumotlarini yuklashda xatolik yuz berdi"
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadTable()
    }
  }, [params.id, router, toast, t]) // Add t to dependency array

  const handleOrderFromTable = () => {
    // Ensure table info is stored
    if (table) {
      localStorage.setItem("selected_table_id", table.id)
      localStorage.setItem("delivery_type", "atTheRestaurant")
      localStorage.setItem("table_info", JSON.stringify(table))
    }
    router.push("/menu")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading_table_data")}</p> {/* "Stol ma'lumotlari yuklanmoqda..." */}
        </div>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-4">{t("table_not_found_title")}</h1> {/* "Stol topilmadi" */}
          <p className="text-gray-600 mb-4">{t("invalid_table_id_description")}</p> {/* "Kiritilgan stol ID si noto'g'ri yoki mavjud emas" */}
          <Button onClick={() => router.push("/")}>{t("back_to_homepage_button")}</Button> {/* "Bosh sahifaga qaytish" */}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("welcome_to_amur_restaurant")}</h1> {/* "Amur Restoraniga xush kelibsiz!" */}
            <p className="text-gray-600">{t("your_selected_table_info")}</p> {/* "Siz tanlagan stol ma'lumotlari" */}
          </div>

          <Card className="animate-fade-in-up animation-delay-200 shadow-xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {table.zone} - {table.name}
              </CardTitle>
              <div className="flex justify-center mt-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {t("your_table_badge")} {/* "Sizning stolingiz" */}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">{t("table_details_title")}</h3> {/* "Stol ma'lumotlari" */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-orange-600 font-medium">{t("table_name_label")}</p> {/* "Stol nomi" */}
                    <p className="font-bold text-lg">{table.name}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-orange-600 font-medium">{t("table_zone_label")}</p> {/* "Zona" */}
                    <p className="font-bold text-lg">{table.zone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2 text-lg">{t("table_ready_title")}</h4> {/* "Stol tayyor!" */}
                <p className="text-green-700">
                  {t("table_ready_description")} {/* "Siz bu stoldan buyurtma bera olasiz. Taomlar to'g'ridan-to'g'ri bu stolga yetkaziladi." */}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleOrderFromTable}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 text-lg py-6"
                  size="lg"
                >
                  <Utensils className="h-5 w-5 mr-2" />
                  {t("place_order_button_table")} {/* "Buyurtma berish" */}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full transform hover:scale-105 transition-all duration-200 border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  {t("back_to_homepage_button_general")} {/* "Bosh sahifaga qaytish" */}
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">{t("additional_info_title")}</h4> {/* "Qo'shimcha ma'lumot" */}
                </div>
                <p className="text-blue-700 text-sm">
                  {t("additional_info_description")} {/* "Buyurtma bergandan so'ng, taomlaringiz to'g'ridan-to'g'ri bu stolga yetkaziladi. Buyurtma berish uchun yuqoridagi tugmani bosing." */}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
