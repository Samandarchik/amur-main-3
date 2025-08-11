
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, MapPin, Eye, Loader2, CheckCircle, ChefHat, Truck, Package, CreditCard } from "lucide-react" // Barcha kerakli ikonalar import qilindi
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { api, type Order } from "@/lib/api"
import { AuthModal } from "@/components/auth/auth-modal"
import { useLanguage } from "@/hooks/use-language" // useLanguage hookini import qilish

export default function OrdersPage() {
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { t, language } = useLanguage() // useLanguage hookini chaqirish

  // statusConfig va deliveryTypeLabels endi komponent ichida, t() ga kirish imkoniyati bor
  const statusConfig = {
    pending: { label: t("orders.pending"), color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: t("orders.confirmed"), color: "bg-blue-100 text-blue-800" },
    preparing: { label: t("orders.preparing"), color: "bg-orange-100 text-orange-800" },
    ready: { label: t("orders.ready"), color: "bg-green-100 text-green-800" },
    delivered: { label: t("orders.delivered"), color: "bg-green-100 text-green-800" },
    cancelled: { label: t("orders.cancelled"), color: "bg-red-100 text-red-800" },
  } as const;

  const deliveryTypeLabels = {
    delivery: t("delivery_option_delivery"),
    own_withdrawal: t("delivery_option_pickup"),
    atTheRestaurant: t("delivery_option_at_restaurant"),
  } as const;

  // Helper function to fix image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg"

    // Check if imageUrl already contains localhost or starts with http
    if (imageUrl.includes('localhost') || imageUrl.startsWith('http')) {
      // Replace localhost URL with demo.iqbo.uz and extract the path
      const urlPath = imageUrl.replace(/^https?:\/\/[^\/]+/, '')
      return `http://https://backend.amur1.uz${urlPath}`
    }

    // If it's just a path, prepend the base URL
    return `http://https://backend.amur1.uz${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const params = statusFilter !== "all" ? { status: statusFilter } : undefined
        const response = await api.getUserOrders(params, token || undefined)
        setOrders(response?.orders || [])
      } catch (error) {
        console.error("Failed to load orders:", error)
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [isAuthenticated, token, statusFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US").format(price) + ` ${t("currency")}`
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const locale = language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US";
    return {
      date: date.toLocaleDateString(locale),
      time: date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("orders.title")}</h1>
          <p className="text-gray-600 mb-4">{t("orders.login_to_view")}</p>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("orders.title")}</h1>
          <p className="text-gray-600">{t("orders.all_orders_subtitle")}</p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("orders.filter_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("categories.all")}</SelectItem>
            {Object.keys(statusConfig).map((statusKey) => (
              <SelectItem key={statusKey} value={statusKey}>
                {statusConfig[statusKey as keyof typeof statusConfig].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t("orders.loading_orders")}</p>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("orders.no_orders_found_title")}</h3>
          <p className="text-gray-500 mb-4">
            {statusFilter === "all"
              ? t("orders.no_orders_yet")
              : t("orders.no_orders_filtered")}
          </p>
          <Button onClick={() => router.push("/menu")}>{t("orders.place_order_button")}</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderDateTime = formatDateTime(order.order_time)
            const status = statusConfig[order.status as keyof typeof statusConfig]

            return (
              <Card key={order.order_id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{t("orders.order_number_title", { orderId: order.order_id })}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {orderDateTime.date} • {orderDateTime.time}
                      </p>
                    </div>
                    <Badge className={status?.color}>{status?.label}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">{t("orders.order_composition_title")}</h4>
                      <div className="space-y-2">
                        {order.foods?.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.count} x {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.foods && order.foods.length > 3 && (
                          <p className="text-sm text-gray-500">{t("orders.other_items_count", { count: order.foods.length - 3 })}</p>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t("orders.total_amount_label")}:</span>
                        <span className="font-semibold">{formatPrice(order.total_price)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {deliveryTypeLabels[order.delivery_type as keyof typeof deliveryTypeLabels]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{t("orders.estimated_time_label", { time: order.estimated_time })}</span>
                      </div>

                      <div className="pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => router.push(`/orders/${order.order_id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t("orders.view_details_button")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
