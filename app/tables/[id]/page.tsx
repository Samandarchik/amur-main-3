"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, Users, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api, type RestaurantTable } from "@/lib/api"
import { useLanguage } from "@/hooks/use-language"

export default function TablePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [table, setTable] = useState<RestaurantTable | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const {t} = useLanguage()

  useEffect(() => {
    const loadTable = async () => {
      try {
        setIsLoading(true)
        const tables = await api.getRestaurantTables()
        const foundTable = tables.find((t) => t.id === params.id)

        if (foundTable) {
          setTable(foundTable)
        } else {
          toast({
            title: "Stol topilmadi",
            description: "Kiritilgan stol ID si mavjud emas",
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Failed to load table:", error)
        toast({
          title: "Xatolik yuz berdi",
          description: "Stol ma'lumotlarini yuklashda xatolik yuz berdi",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadTable()
    }
  }, [params.id, router, toast])

  const handleOrderFromTable = () => {
    // Store table ID in localStorage for checkout
    localStorage.setItem("selected_table_id", params.id as string)
    router.push("/menu")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading_table_data')}</p>
        </div>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-4">{t('table_not_found_title')}</h1>
          <p className="text-gray-600 mb-4">{t('table_not_found_description')}</p>
          <Button onClick={() => router.push("/")}>{t("back_to_homepage_button")}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="animate-fade-in-up">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-10 w-10 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">
              {table.zone} - {table.name}
            </CardTitle>
            <div className="flex justify-center">
              <Badge className={table.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {table.is_available ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {t('tables.available')}
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-1" />
                    {t("tables.occupied")}
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t('table_details_title')}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Stol ID</p>
                  <p className="font-medium">{table.id}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">{t('table_zone_label')}</p>
                  <p className="font-medium">{table.zone}</p>
                </div>
              </div>
            </div>

            {table.is_available ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800 mb-1">Stol bo'sh</h4>
                  <p className="text-green-700 text-sm">{t('table_ready_description')}</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleOrderFromTable}
                    className="w-full transform hover:scale-105 transition-all duration-200"
                    size="lg"
                  >
                    <Utensils className="h-5 w-5 mr-2" />

                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/menu")}
                    className="w-full transform hover:scale-105 transition-all duration-200"
                  >
                    {t('food.viewMenu')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-red-800 mb-1">{t('tables.occupied')}</h4>
                  <p className="text-red-700 text-sm">{t('tables.reserved')}</p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full transform hover:scale-105 transition-all duration-200"
                >
                  {t('back_to_homepage_button_general')}
                </Button>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-800">{t('additional_info_title')}</h4>
              </div>
              <p className="text-blue-700 text-sm">
               {t('additional_info_description')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
