"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { MapPin, CreditCard, Banknote, Smartphone, Store, Utensils, Navigation, CheckCircle, AlertTriangle } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { api, type CreateOrderRequest, type RestaurantTable } from "@/lib/api"
import { AuthModal } from "@/components/auth/auth-modal"
import { useLanguage } from "@/hooks/use-language";


// Restaurant coordinates
const RESTAURANT_LAT = 39.7013044
const RESTAURANT_LNG = 67.0143978
const MAX_DISTANCE = 100 // meters

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage() // Assuming t is available from useLanguage

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [deliveryType, setDeliveryType] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [selectedTable, setSelectedTable] = useState("")
  const [preSelectedTable, setPreSelectedTable] = useState<RestaurantTable | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
  })
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocationVerified, setIsLocationVerified] = useState(false)
  const [locationDistance, setLocationDistance] = useState<number | null>(null)

  // Check for pre-selected table from localStorage
  useEffect(() => {
    const storedTableId = localStorage.getItem("selected_table_id")
    const storedDeliveryType = localStorage.getItem("delivery_type")
    const storedTableInfo = localStorage.getItem("table_info")

    if (storedTableId && storedDeliveryType === "atTheRestaurant") {
      setDeliveryType("atTheRestaurant")
      setSelectedTable(storedTableId)

      if (storedTableInfo) {
        try {
          const tableInfo = JSON.parse(storedTableInfo)
          setPreSelectedTable(tableInfo)
        } catch (error) {
          console.error("Failed to parse table info:", error)
        }
      }
    }
  }, [])

  // Reset delivery type if preSelectedTable becomes null
  useEffect(() => {
    if (!preSelectedTable && deliveryType === "atTheRestaurant") {
      setDeliveryType("delivery")
    }
  }, [preSelectedTable, deliveryType])

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    } else if (user) {
      // Pre-fill customer info from user data (phone number readonly)
      setCustomerInfo({
        name: user.full_name,
        phone: user.number,
        email: user.email || "",
      })
      setDeliveryInfo((prev) => ({
        ...prev,
        phone: user.number,
      }))
    }
  }, [isAuthenticated, user])

  // Verify location when delivery type changes to atTheRestaurant
  useEffect(() => {
    if (deliveryType === "atTheRestaurant" && currentLocation) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        RESTAURANT_LAT,
        RESTAURANT_LNG
      )
      setLocationDistance(distance)
      setIsLocationVerified(distance <= MAX_DISTANCE)
    } else {
      setIsLocationVerified(false)
      setLocationDistance(null)
    }
  }, [deliveryType, currentLocation])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + ` ${t("sum")}` // "so'm"
  }

  const deliveryFee = deliveryType === "delivery" ? 5000 : 0
  const serviceCharge = deliveryType === "atTheRestaurant" ? Math.round(total * 0.1) : 0
  const finalTotal = total + deliveryFee + serviceCharge

  const getCurrentLocation = () => {
    setIsGettingLocation(true)

    if (!navigator.geolocation) {
      toast({
        title: t("geolocation_not_supported_title"), // "Geolocation qo'llab-quvvatlanmaydi"
        description: t("geolocation_not_supported_description"), // "Brauzeringiz geolocation xizmatini qo'llab-quvvatlamaydi"
        variant: "destructive",
      })
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        setCurrentLocation({ lat, lng })
        
        if (deliveryType === "delivery") {
          setDeliveryInfo((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }))
        }
        
        toast({
          title: t("location_detected_title"), // "Joylashuv aniqlandi"
          description: t("location_detected_description"), // "Sizning joylashuvingiz muvaffaqiyatli aniqlandi"
        })
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast({
          title: t("location_detection_failed_title"), // "Joylashuvni aniqlab bo'lmadi"
          description: t("location_detection_failed_description"), // "Joylashuvni aniqlashda xatolik yuz berdi. Qo'lda kiriting."
          variant: "destructive",
        })
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const verifyLocationForRestaurant = () => {
    setIsGettingLocation(true)

    if (!navigator.geolocation) {
      toast({
        title: t("geolocation_not_supported_title"),
        description: t("geolocation_not_supported_description"),
        variant: "destructive",
      })
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const distance = calculateDistance(lat, lng, RESTAURANT_LAT, RESTAURANT_LNG)
        
        setCurrentLocation({ lat, lng })
        setLocationDistance(distance)
        setIsLocationVerified(distance <= MAX_DISTANCE)
        
        if (distance <= MAX_DISTANCE) {
          toast({
            title: t("location_verified_title"), // "Joylashuv tasdiqlandi"
            description: t("location_verified_description"), // "Siz restoran yaqinida ekanligingiz tasdiqlandi"
          })
        } else {
          toast({
            title: t("location_too_far_title"), // "Juda uzoqdasiz"
            description: t("location_too_far_description"), // "Restoranda ovqatlanish uchun restoran yaqinida bo'lishingiz kerak"
            variant: "destructive",
          })
        }
        
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast({
          title: t("location_detection_failed_title"),
          description: t("location_detection_failed_description"),
          variant: "destructive",
        })
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    // Check location verification for restaurant orders
    if (deliveryType === "atTheRestaurant" && !isLocationVerified) {
      toast({
        title: t("location_verification_required_title"), // "Joylashuv tasdiqlanishi kerak"
        description: t("location_verification_required_description"), // "Restoranda ovqatlanish uchun avval joylashuvingizni tasdiqlang"
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare order data
      const orderData: CreateOrderRequest = {
        items: items.map((item) => ({
          food_id: item.id,
          quantity: item.quantity,
        })),
        delivery_type: deliveryType as "delivery" | "own_withdrawal" | "atTheRestaurant",
        delivery_info: {},
        payment_method: paymentMethod as "cash" | "card" | "click" | "payme",
        special_instructions: specialInstructions || undefined,
        customer_info: customerInfo,
      }

      // Set delivery info based on type
      if (deliveryType === "delivery") {
        orderData.delivery_info = {
          address: deliveryInfo.address,
          phone: deliveryInfo.phone,
          latitude: deliveryInfo.latitude ? Number.parseFloat(deliveryInfo.latitude) : undefined,
          longitude: deliveryInfo.longitude ? Number.parseFloat(deliveryInfo.longitude) : undefined,
        }
      } else if (deliveryType === "atTheRestaurant") {
        orderData.delivery_info = {
          table_id: selectedTable,
        }
      }

      // Create order via API
      const response = await api.createOrder(orderData, token || undefined)

      // Clear cart and localStorage
      clearCart()
      localStorage.removeItem("selected_table_id")
      localStorage.removeItem("delivery_type")
      localStorage.removeItem("table_info")

      router.push(`/orders`)
    } catch (error) {
      console.error("Order creation failed:", error)
      toast({
        title: t("error_occurred_title"), // "Xatolik yuz berdi"
        description:
          error instanceof Error ? error.message : t("order_creation_failed_generic_description"), // "Buyurtma yaratishda xatolik yuz berdi. Qaytadan urinib ko'ring."
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-4">{t("cart_empty_title")}</h1> {/* "Savat bo'sh" */}
          <p className="text-gray-600 mb-4">{t("cart_empty_description")}</p> {/* "Buyurtma berish uchun avval taomlarni savatga qo'shing" */}
          <Button
            onClick={() => router.push("/menu")}
            className="transform hover:scale-105 transition-all duration-200"
          >
            {t("view_menu_button")} {/* "Menuni ko'rish" */}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in-up">{t("place_order_heading")}</h1> {/* "Buyurtma berish" */}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card className="animate-fade-in-up animation-delay-200">
              <CardHeader>
                <CardTitle>{t("personal_info_title")}</CardTitle> {/* "Shaxsiy ma'lumotlar" */}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("full_name_label")}</Label> {/* "To'liq ism *" */}
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t("phone_number_label")}</Label> {/* "Telefon raqam *" */}
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+ 998 94 700 07 70"
                    value={customerInfo.phone}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    title={t("phone_number_readonly_tooltip")} // "Telefon raqamni o'zgartirib bo'lmaydi"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Type */}
            <Card className="animate-fade-in-up animation-delay-400">
              <CardHeader>
                <CardTitle>{t("delivery_type_title")}</CardTitle> {/* "Yetkazib berish turi" */}
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{t("delivery_option_delivery")}</span> {/* "Yetkazib berish" */}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{t("delivery_option_delivery_description")}</p> {/* "Sizning manzilingizga yetkazib beramiz" */}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="own_withdrawal" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <span className="font-medium">{t("delivery_option_pickup")}</span> {/* "O'zi olib ketish" */}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{t("delivery_option_pickup_description")}</p> {/* "Restoranidan o'zingiz olib ketasiz" */}
                    </Label>
                  </div>
                  {preSelectedTable && (
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <RadioGroupItem value="atTheRestaurant" id="restaurant" />
                      <Label htmlFor="restaurant" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4" />
                          <span className="font-medium">{t("delivery_option_at_restaurant")}</span> {/* "Restoranda" */}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{t("delivery_option_at_restaurant_description")}</p> {/* "Restoran ichida iste'mol qilasiz" */}
                        <p className="text-sm text-orange-600 mt-1 font-medium">
                          {t("service_charge_note")} {/* "10% xizmat haqi qo'shiladi" */}
                        </p>
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Location Verification for Restaurant Orders */}
            {deliveryType === "atTheRestaurant" && preSelectedTable && (
              <Card className="animate-fade-in-up animation-delay-500">
                <CardHeader>
                  <CardTitle>{t("location_verification_title")}</CardTitle> {/* "Joylashuv tasdiqlash" */}
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isLocationVerified ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-orange-800 mb-2">
                            {t("location_verification_required_title")} {/* "Joylashuv tasdiqlanishi kerak" */}
                          </h4>
                          <p className="text-orange-700 text-sm mb-3">
                            {t("location_verification_description")} {/* "Restoranda ovqatlanish uchun siz restoran yaqinida (100m ichida) bo'lishingiz kerak. Joylashuvingizni tasdiqlash uchun tugmani bosing." */}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={verifyLocationForRestaurant}
                            disabled={isGettingLocation}
                            className="w-full"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            {isGettingLocation ? t("verifying_location_button") : t("verify_location_button")} {/* "Joylashuv tekshirilmoqda..." : "Joylashuvni tasdiqlash" */}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-green-800">
                            {t("location_verified_title")} {/* "Joylashuv tasdiqlandi" */}
                          </h4>
                          <p className="text-green-700 text-sm">
                            {t("location_verified_description")} {/* "Siz restoran yaqinida ekanligingiz tasdiqlandi" */}
                            {locationDistance && (
                              <span className="font-medium ml-1">
                                ({Math.round(locationDistance)}m {t("distance_away")}) {/* "uzoqlikda" */}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {locationDistance !== null && !isLocationVerified && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <div>
                          <h4 className="font-semibold text-red-800">
                            {t("location_too_far_title")} {/* "Juda uzoqdasiz" */}
                          </h4>
                          <p className="text-red-700 text-sm">
                            {t("location_too_far_detailed_description")} {/* "Siz restoranidan {distance}m uzoqdasiz. Restoranda ovqatlanish uchun 100m ichida bo'lishingiz kerak." */}
                         {t("distance_away", { distance: Math.round(locationDistance ) })}

                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Delivery Address */}
            {deliveryType === "delivery" && (
              <Card className="animate-fade-in-up animation-delay-600">
                <CardHeader>
                  <CardTitle>{t("delivery_address_title")}</CardTitle> {/* "Yetkazib berish manzili" */}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">{t("address_label")}</Label> {/* "Manzil *" */}
                    <Textarea
                      id="address"
                      placeholder={t("address_placeholder")} // "To'liq manzilingizni kiriting"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                      required
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-phone">{t("phone_number_label")}</Label> {/* "Telefon raqam *" */}
                    <Input
                      id="delivery-phone"
                      type="tel"
                      placeholder="+ 998 94 700 07 70"
                      value={deliveryInfo.phone}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                      title={t("phone_number_readonly_tooltip")} // "Telefon raqamni o'zgartirib bo'lmaydi"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="41.2995"
                        value={deliveryInfo.latitude}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, latitude: e.target.value })}
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="69.2401"
                        value={deliveryInfo.longitude}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, longitude: e.target.value })}
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full transform hover:scale-105 transition-all duration-200"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {isGettingLocation ? t("getting_location_button") : t("detect_location_button")} {/* "Joylashuv aniqlanmoqda..." : "Joriy joylashuvni aniqlash" */}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Table Selection - Pre-selected */}
            {deliveryType === "atTheRestaurant" && 
             preSelectedTable && 
             preSelectedTable.zone && 
             preSelectedTable.name && (
              <Card className="animate-fade-in-up animation-delay-600">
                <CardHeader>
                  <CardTitle>{t("selected_table_title")}</CardTitle> {/* "Tanlangan stol" */}
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">
                          {preSelectedTable.zone} - {preSelectedTable.name}
                        </h4>
                        <p className="text-green-700 text-sm">
                          {t("selected_table_description")} {/* "Siz bu stoldan buyurtma berasiz. Taomlar to'g'ridan-to'g'ri bu stolga yetkaziladi." */}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="animate-fade-in-up animation-delay-800">
              <CardHeader>
                <CardTitle>{t("payment_method_title")}</CardTitle> {/* "To'lov usuli" */}
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        <span className="font-medium">{t("payment_method_cash")}</span> {/* "Naqd pul" */}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">{t("payment_method_card")}</span> {/* "Bank kartasi" */}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="click" id="click" />
                    <Label htmlFor="click" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="font-medium">{t("payment_method_click")}</span> {/* "Click" */}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="payme" id="payme" />
                    <Label htmlFor="payme" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="font-medium">{t("payment_method_payme")}</span> {/* "Payme" */}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card className="animate-fade-in-up animation-delay-1000">
              <CardHeader>
                <CardTitle>{t("special_instructions_title")}</CardTitle> {/* "Qo'shimcha izohlar" */}
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t("special_instructions_placeholder")} // "Maxsus talablar yoki izohlar (ixtiyoriy)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="transition-all duration-200 focus:scale-105"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4 animate-fade-in-up animation-delay-1200">
              <CardHeader>
                <CardTitle>{t("order_summary_title")}</CardTitle> {/* "Buyurtma xulosasi" */}
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                      <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("food_price_label")}</span> {/* "Taomlar narxi:" */}
                    <span>{formatPrice(total)}</span>
                  </div>
                  {deliveryType === "delivery" && (
                    <div className="flex justify-between text-sm">
                      <span>{t("delivery_fee_label")}</span> {/* "Yetkazib berish:" */}
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  {deliveryType === "atTheRestaurant" && (
                    <div className="flex justify-between text-sm">
                      <span>{t("service_charge_label")}</span> {/* "Xizmat haqi (10%):" */}
                      <span>{formatPrice(serviceCharge)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t("total_label")}</span> {/* "Jami:" */}
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full transform hover:scale-105 transition-all duration-200"
                  size="lg"
                  disabled={
                    isSubmitting || 
                    !isAuthenticated || 
                    (deliveryType === "atTheRestaurant" && !isLocationVerified)
                  }
                >
                  {isSubmitting
                    ? t("submitting_order_button") // "Buyurtma berilmoqda..."
                    : !isAuthenticated
                      ? t("login_to_order_button") // "Avval tizimga kiring"
                      : deliveryType === "atTheRestaurant" && !isLocationVerified
                        ? t("verify_location_first_button") // "Avval joylashuvni tasdiqlang"
                        : t("place_order_button")} {/* "Buyurtma berish" */}
                </Button>

                <p className="text-xs text-gray-500 text-center">{t("order_confirmation_note")}</p> {/* "Buyurtma bergandan so'ng, siz bilan bog'lanamiz" */}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} defaultTab="login" />
    </div>
  )
}