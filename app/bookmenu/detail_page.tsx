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

  // Handle escape key
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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-6 right-6 z-10 text-white hover:bg-white/20 rounded-full w-12 h-12"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Overlay Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {food.is_popular && (
          <Badge className="bg-red-500/90 text-white backdrop-blur-sm px-3 py-1">
            {t("seating.popular")}
          </Badge>
        )}
        {food.discount > 0 && (
          <Badge className="bg-orange-500/90 text-white backdrop-blur-sm px-3 py-1">
            -{food.discount}%
          </Badge>
        )}
      </div>

      {/* Full Screen Image */}
      <div className="relative w-full h-full">
        <img
          src={getImageUrl(food.imageUrl)}
          alt={food.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=800&width=600";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Content at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-white">
                {formatPrice(food.price)}
              </span>
              {food.original_price > 0 && (
                <span className="text-xl text-white/70 line-through">
                  {formatPrice(food.original_price)}
                </span>
              )}
            </div>
            {food.category_name && (
              <Badge variant="secondary" className="text-white bg-white/20 backdrop-blur-sm border-0">
                {food.category_name}
              </Badge>
            )}
          </div>

          {/* Food Name */}
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            {food.name}
          </h1>

       {/* Ingredients */}
{food.ingredients && (
  <div className="mb-6">
    <div className="flex flex-wrap gap-2 text-lg text-white/90">
      {food.ingredients[language as keyof typeof food.ingredients] &&
      food.ingredients[language as keyof typeof food.ingredients].length > 0 ? (
        food.ingredients[language as keyof typeof food.ingredients].map((ingredient, index, array) => (
          <span key={index}>
            {ingredient}
            {index < array.length - 1 && <span className="mx-2 text-white/60">•</span>}
          </span>
        ))
      ) : (
        Object.values(food.ingredients).flat().filter(Boolean).length > 0 && (
          Object.values(food.ingredients).flat().filter(Boolean).map((ingredient, index, array) => (
            <span key={index}>
              {ingredient}
              {index < array.length - 1 && <span className="mx-2 text-white/60">•</span>}
            </span>
          ))
        )
      )}

      {/* Times oxirida */}
      <span className="flex items-center gap-2 ml-4 text-white/80">
        <Clock className="h-5 w-5" />
        <span>{food.preparation_time} min</span>
      </span>
    </div>
  </div>
)}


          {/* Back Button */}
          <Button
            className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-3"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
            {t("common.back") || "Back"}
          </Button>
        </div>

        {/* Availability Overlay */}
        {!food.isThere && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <Badge variant="secondary" className="text-xl px-6 py-3 bg-white/90 backdrop-blur-sm">
              {t("food.outOfStock")}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}