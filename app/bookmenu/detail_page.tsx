"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  ArrowLeft,
  X,
  Users,
  Heart,
  Share2,
  ChefHat,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { type Food } from "@/lib/api";

interface FoodDetailModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FoodDetailModal({ food, isOpen, onClose }: FoodDetailModalProps) {
  const { language, t } = useLanguage();

  // Helper function to fix image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg?height=400&width=600";

    if (imageUrl.includes("localhost") || imageUrl.startsWith("http")) {
      const urlPath = imageUrl.replace(/^https?:\/\/[^\/]+/, "");
      return `https://uzjoylar-yoqj.onrender.com${urlPath}`;
    }

    return `https://uzjoylar-yoqj.onrender.com${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " " + t("currency");
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
          relative w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl
          transform transition-all duration-300 ease-out max-h-[90vh] overflow-hidden
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}
      >
        {/* Header with Larger Image */}
        <div className="relative">
          <img
            src={getImageUrl(food.imageUrl)}
            alt={food.name}
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=400&width=600";
            }}
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {food.is_popular && (
              <Badge className="bg-red-500/90 text-white backdrop-blur-sm">
                {t("seating.popular")}
              </Badge>
            )}
            {food.discount > 0 && (
              <Badge className="bg-orange-500/90 text-white backdrop-blur-sm">
                -{food.discount}%
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/80 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Availability Overlay */}
          {!food.isThere && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/90 backdrop-blur-sm">
                {t("food.outOfStock")}
              </Badge>
            </div>
          )}

          {/* Gradient overlay for better text readability */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Scrollable Content with transparent background */}
        <div className="overflow-y-auto max-h-[50vh] px-6 py-6 space-y-6 pb-8 bg-white/80 backdrop-blur-md">
          {/* Title and Rating */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {food.name}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-800">{food.stock} {t("food.available")}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600 bg-white/70">
                {food.category_name}
              </Badge>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
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
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-gray-800">
              <ChefHat className="h-5 w-5 text-gray-600" />
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Preparation Time and Serving */}
          <div className="flex items-center gap-6 bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">
                {food.preparation_time} min
              </span>
            </div>
          </div>

          {/* Ingredients */}
          {food.ingredients && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Check if ingredients exist for current language */}
                {food.ingredients[language as keyof typeof food.ingredients] && 
                 food.ingredients[language as keyof typeof food.ingredients].length > 0 ? (
                  food.ingredients[language as keyof typeof food.ingredients].map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3 bg-white/80">
                      {ingredient}
                    </Badge>
                  ))
                ) : (
                  /* Fallback to other languages if current language doesn't have ingredients */
                  Object.values(food.ingredients).flat().filter(Boolean).length > 0 ? (
                    Object.values(food.ingredients).flat().filter(Boolean).map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3 bg-white/80">
                        {ingredient}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No ingredients information available</p>
                  )
                )}
              </div>
            </div>
          )}

          {/* Allergens */}
          {food.allergens && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Allergens
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Check if allergens exist for current language */}
                {food.allergens[language as keyof typeof food.allergens] && 
                 food.allergens[language as keyof typeof food.allergens].length > 0 ? (
                  food.allergens[language as keyof typeof food.allergens].map((allergen, index) => (
                    <Badge key={index} variant="destructive" className="text-sm py-1 px-3 bg-red-500/90">
                      {allergen}
                    </Badge>
                  ))
                ) : (
                  /* Fallback to other languages if current language doesn't have allergens */
                  Object.values(food.allergens).flat().filter(Boolean).length > 0 ? (
                    Object.values(food.allergens).flat().filter(Boolean).map((allergen, index) => (
                      <Badge key={index} variant="destructive" className="text-sm py-1 px-3 bg-red-500/90">
                        {allergen}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No allergen information available</p>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar - Back Button */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200/50 p-6">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
            {t("common.back") || "Back"}
          </Button>
        </div>
      </div>
    </div>
  );
}