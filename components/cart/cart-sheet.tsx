"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useLanguage } from "@/hooks/use-language"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, total, updateQuantity, removeItem, itemCount } = useCart()
  const {t} = useLanguage()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  // URL ni to'g'irlash funksiyasi - yangilangan va kuchaytirgan
  const fixImageUrl = (url: string) => {
    if (!url) {
      console.log('URL mavjud emas, placeholder qaytarish')
      return "/placeholder.svg"
    }

    console.log('Original URL:', url)

    // Localhost URLlarini to'g'rirlash (barcha mumkin bo'lgan portlar)
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      // Har qanday localhost URLni almashtirish
      const fixed = url.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, 'http://https://uzjoylar-yoqj.onrender.com')
      console.log('Fixed localhost URL:', fixed)
      return fixed
    }

    // Agar URL /uploads/ dan boshlansa, to'liq URL yasash
    if (url.startsWith('/uploads/')) {
      const fixed = `http://https://uzjoylar-yoqj.onrender.com${url}`
      console.log('Fixed relative URL:', fixed)
      return fixed
    }

    // Agar URL uploads/ dan boshlansa (slash yoq), to'liq URL yasash
    if (url.startsWith('uploads/')) {
      const fixed = `http://https://uzjoylar-yoqj.onrender.com/${url}`
      console.log('Fixed relative URL without slash:', fixed)
      return fixed
    }

    // Agar URL allaqachon to'g'ri bo'lsa
    if (url.startsWith('http://https://uzjoylar-yoqj.onrender.com')) {
      console.log('URL allaqachon to\'g\'ri:', url)
      return url
    }

    // Boshqa hollarda ham demo.iqbo.uz ga yo'naltirish
    if (!url.startsWith('http')) {
      const fixed = `http://https://uzjoylar-yoqj.onrender.com/${url.replace(/^\/+/, '')}`
      console.log('Fixed other URL:', fixed)
      return fixed
    }

    console.log('URL o\'zgarishsiz:', url)
    return url
  }

  // Rasm yuklash xatolarini boshqarish
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement
    console.log('Rasm yuklashda xatolik:', target.src)
    target.src = "/placeholder.svg"
  }

  if (items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{t('nav.cart')}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('cart.empty')}</h3>
              <p className="text-gray-500 mb-4">{t('cart_empty_description')}</p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/menu">{t('nav.menu')}</Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {t('sheet')}
            <Badge variant="secondary">{itemCount} {t('categories.items')}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {items.map((item) => {
              const imageUrl = fixImageUrl(item.imageUrl)
              console.log(`Mahsulot ${item.name} uchun rasm URL:`, imageUrl)

              return (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                    onError={handleImageError}
                    onLoad={() => console.log(`Rasm muvaffaqiyatli yuklandi: ${imageUrl}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>{t('cart.total')}:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button className="w-full" size="lg" asChild onClick={() => onOpenChange(false)}>
            <Link href="/checkout">{t('hero.orderNow')}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}