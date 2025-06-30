"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Clock, Plus, Minus, ArrowLeft, Heart, Share2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { api, type Food } from "@/lib/api"
import { useLanguage } from "@/hooks/use-language"

interface FoodDetailPageProps {
  foodId: string
}

export default function FoodDetailPage({ foodId }: FoodDetailPageProps) {
  const [food, setFood] = useState<Food | null>(null)
  const [relatedFoods, setRelatedFoods] = useState<Food[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem, removeItem, items } = useCart()
  const { language, t } = useLanguage()
  const router = useRouter()

  // Helper to get item quantity from cart items
  const getItemQuantity = (id: string) => {
    const item = items.find((item) => item.id === id)
    return item ? item.quantity : 0
  }

  // Helper function to fix image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg?height=400&width=600"

    if (imageUrl.includes('localhost') || imageUrl.startsWith('http')) {
      const urlPath = imageUrl.replace(/^https?:\/\/[^\/]+/, '')
      return `http://localhost:8080${urlPath}`
    }

    return `http://localhost:8080${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
  }

  // Load food details
  useEffect(() => {
    const loadFoodDetails = async () => {
      try {
        setIsLoading(true)
        
        // Load specific food details (you'll need to implement this API call)
        const foodData = await api.getFood(foodId)
        setFood(foodData)

        // Load related foods from same category
        if (foodData.category) {
          const relatedData = await api.getFoods({
            category: foodData.category_name,
            limit: 4,
            page: 1
          })
          setRelatedFoods(relatedData.foods.filter(f => f.id !== foodId))
        }

      } catch (error) {
        console.error("Failed to load food details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (foodId) {
      loadFoodDetails()
    }
  }, [foodId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " " + t("currency")
  }

  const handleAddItem = (food: Food) => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      imageUrl: food.imageUrl,
      category: food.category_name,
    })
  }

  const handleDecreaseItem = (foodId: string) => {
    const currentQuantity = getItemQuantity(foodId)
    if (currentQuantity > 1) {
      const item = items.find((item) => item.id === foodId)
      if (item) {
        removeItem(foodId)
        for (let i = 0; i < currentQuantity - 1; i++) {
          addItem(item)
        }
      }
    } else {
      removeItem(foodId)
    }
  }

  const handleShare = async () => {
    if (navigator.share && food) {
      try {
        await navigator.share({
          title: food.name,
          text: food.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center animate-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Taom topilmadi</h2>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ortga qaytish
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const quantity = getItemQuantity(food.id)
  const totalPrice = quantity * food.price

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ortga
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Food Image */}
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={getImageUrl(food.imageUrl)}
              alt={food.name}
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=400&width=600"
              }}
            />
            {food.is_popular && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                NEW
              </Badge>
            )}
            {food.discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-red-500">
                -{food.discount}%
              </Badge>
            )}
            {!food.isThere && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {t("food.outOfStock")}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Food Info */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3">
                {food.category_name}
              </Badge>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {food.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{food.rating}</span>
                  <span className="text-gray-600">({food.review_count} baho)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{food.preparation_time} {t("hero.minute")}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {food.description}
          </p>

          <Separator className="my-6" />

          {/* Price Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(food.price)}
              </span>
              {food.original_price > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(food.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="flex items-center justify-between">
            {quantity === 0 ? (
              <Button
                size="lg"
                disabled={!food.isThere}
                onClick={() => handleAddItem(food)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
              >
                <Plus className="h-5 w-5 mr-2" />

              </Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 bg-green-600 rounded-xl p-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDecreaseItem(food.id)}
                    className="h-10 w-10 p-0 text-white hover:bg-green-700 rounded-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-bold text-white text-xl min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddItem(food)}
                    className="h-10 w-10 p-0 text-white hover:bg-green-700 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Jami:</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Foods */}
        {relatedFoods.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              O'xshash taomlar
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedFoods.map((relatedFood) => {
                const relatedQuantity = getItemQuantity(relatedFood.id)
                
                return (
                  <Card
                    key={relatedFood.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/food/${relatedFood.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(relatedFood.imageUrl)}
                        alt={relatedFood.name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                      {relatedFood.is_popular && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {relatedFood.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600 text-sm">
                          {formatPrice(relatedFood.price)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {relatedFood.rating}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}