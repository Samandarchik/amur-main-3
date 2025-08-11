"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  Plus,
  Minus,
  X,
  Users,
  Heart,
  Share2,
  ChefHat,
  AlertTriangle,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/hooks/use-language";
import { type Food } from "@/lib/api";

interface FoodDetailModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FoodDetailModal({ food, isOpen, onClose }: FoodDetailModalProps) {
  const { addItem, removeItem, items } = useCart();
  const { language, t } = useLanguage();

  // Get item quantity from cart
  const getItemQuantity = (id: string) => {
    const item = items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const quantity = food ? getItemQuantity(food.id) : 0;

  // Helper function to fix image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg?height=400&width=600";

    if (imageUrl.includes("localhost") || imageUrl.startsWith("http")) {
      const urlPath = imageUrl.replace(/^https?:\/\/[^\/]+/, "");
      return `https://backend.amur1.uz${urlPath}`;
    }

    return `https://backend.amur1.uz${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " " + t("currency");
  };

  const handleAddItem = () => {
    if (!food) return;
    
    // Stock limitini tekshirish
    const currentQuantity = getItemQuantity(food.id);
    if (currentQuantity >= food.stock) {
      return; // Stock limitiga yetganda qo'shmaslik
    }
    
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      imageUrl: food.imageUrl,
      category: food.category_name,
    });
  };

  const handleDecreaseItem = () => {
    if (!food) return;
    const currentQuantity = getItemQuantity(food.id);
    if (currentQuantity > 1) {
      const item = items.find((item) => item.id === food.id);
      if (item) {
        removeItem(food.id);
        for (let i = 0; i < currentQuantity - 1; i++) {
          addItem(item);
        }
      }
    } else {
      removeItem(food.id);
    }
  };



  // Stock tugaganligi yoki yetarli emasligi haqida xabar
  const getStockMessage = () => {
    if (!food) return "";
    
    const remainingStock = food.stock - quantity;
    if (remainingStock === 0 && quantity > 0) {
      return t("food.allStockInCart") || "All available items are in your cart";
    }
    if (remainingStock > 0 && remainingStock <= 3) {
      return `${t("food.onlyLeft") || "Only"} ${remainingStock} ${t("food.itemsLeft") || "items left"}`;
    }
    return "";
  };

  // Handle escape key and backdrop click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !food) return null;

  const isMaxQuantityReached = quantity >= food.stock;
  const stockMessage = getStockMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`
          relative w-full max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl
          transform transition-all duration-300 ease-out max-h-[90vh] overflow-hidden
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}
      >
        {/* Header with Image */}
        <div className="relative">
          <img
            src={getImageUrl(food.imageUrl)}
            alt={food.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=400&width=600";
            }}
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {food.is_popular && (
              <Badge className="bg-red-500 text-white">
                {t("seating.popular")}
              </Badge>
            )}
            {food.discount > 0 && (
              <Badge className="bg-orange-500 text-white">
                -{food.discount}%
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/90 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Availability Overlay */}
          {!food.isThere && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {t("food.outOfStock")}
              </Badge>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[60vh] px-6 py-6 space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {food.name}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{food.stock} {t("food.available")}</span>
                  {quantity > 0 && (
                    <span className="text-sm text-gray-500">
                      ({food.stock - quantity} {t("food.remaining") || "remaining"})
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {food.category_name}
              </Badge>
            </div>
          </div>

          {/* Stock Warning Message */}
          {stockMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700 font-medium">
                  {stockMessage}
                </span>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-600">
              {formatPrice(food.price)}
            </span>
            {food.original_price > 0 && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(food.original_price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-gray-600" />
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Preparation Time and Serving */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">
                {food.preparation_time} min
              </span>
            </div>
          </div>

          {/* Ingredients */}
          {food.ingredients && food.ingredients[language as keyof typeof food.ingredients]?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {food.ingredients[language as keyof typeof food.ingredients].map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {food.allergens && food.allergens[language as keyof typeof food.allergens]?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Allergens
              </h3>
              <div className="flex flex-wrap gap-2">
                {food.allergens[language as keyof typeof food.allergens].map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-sm">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {food.comment && (
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Chef's Note
              </h3>
              <p className="text-gray-700 italic bg-gray-50 p-4 rounded-lg">
                "{food.comment}"
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex items-center justify-between gap-4">
            {quantity === 0 ? (
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!food.isThere || food.stock === 0}
                onClick={handleAddItem}
              >
                {food.stock === 0 ? 
                  (t("food.outOfStock") || "Out of Stock") : 
                  `${t("food.addToCart")} • ${formatPrice(food.price)}`
                }
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 bg-green-600 rounded-xl p-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDecreaseItem}
                    className="h-10 w-10 text-white hover:bg-green-700 rounded-lg"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="font-bold text-white text-xl min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleAddItem}
                    disabled={isMaxQuantityReached}
                    className="h-10 w-10 text-white hover:bg-green-700 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(food.price * quantity)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total for {quantity} items
                  </div>
                  {isMaxQuantityReached && (
                    <div className="text-xs text-amber-600 font-medium">
                      {t("food.maxQuantityReached") || "Maximum quantity reached"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}