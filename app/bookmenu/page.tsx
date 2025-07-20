"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Clock,
  Plus,
  Search,
  Filter,
  Minus,
  Eye,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { api, type Food, type Category } from "@/lib/api";
import { useLanguage } from "@/hooks/use-language";
import { FoodDetailModal } from "../bookmenu/detail_page";

export default function BookMenu() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  
  // Detail Modal States
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { language, t } = useLanguage();
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);

  // Helper function to get category name by key
  const getCategoryNameByKey = (key: string) => {
    if (key === "all") return null;
    const category = categories.find((cat) => cat.key === key);
    return category ? category.name : null;
  };

  // Helper function to fix image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    if (imageUrl.includes("localhost") || imageUrl.startsWith("http")) {
      const urlPath = imageUrl.replace(/^https?:\/\/[^\/]+/, "");
      return `https://uzjoylar-yoqj.onrender.com${urlPath}`;
    }

    return `https://uzjoylar-yoqj.onrender.com${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  };

  // Open food detail modal
  const handleViewDetails = (food: Food) => {
    setSelectedFood(food);
    setIsDetailModalOpen(true);
  };

  // Close food detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedFood(null);
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load categories
        const categoriesData = await api.getCategories();
        setCategories([
           
          ...categoriesData,
        ]);

        // Load foods
        const foodsData = await api.getFoods({
          page: 1,
          limit: 200,
        });
        setFoods(foodsData.foods);
        setFilteredFoods(foodsData.foods);
      } catch (error) {
        console.error("Failed to load menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [language, t]);



  // Group foods by category
  const groupedFoods = filteredFoods.reduce((acc, food) => {
    const categoryKey = food.category || "other";
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(food);
    return acc;
  }, {} as { [key: string]: Food[] });

  // Scroll to category
  const scrollToCategory = (categoryKey: string) => {
    if (categoryKey === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = sectionRefs.current[categoryKey];
    if (section) {
      const navHeight = categoryNavRef.current?.offsetHeight || 0;
      const offsetTop = section.offsetTop - navHeight - 20;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
    setSelectedCategory(categoryKey);
  };

  // Intersection Observer for active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          setSelectedCategory(entry.target.id);
        }
      });
    }, observerOptions);

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [groupedFoods]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " " + t("currency");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Category Navigation */}
      <div
        ref={categoryNavRef}
        className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={
                  selectedCategory === category.key ? "default" : "ghost"
                }
                size="sm"
                onClick={() => scrollToCategory(category.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.key
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

    <h1 className="text-center text-4xl font-bold text-gray-900 my-8">
        {"Amur Restaurant"}
      </h1>

      {/* Food Sections */}
      <div className="container mx-auto px-4 pb-8">
        {Object.entries(groupedFoods).map(([categoryKey, categoryFoods]) => {
          const categoryInfo = categories.find(
            (cat) => cat.key === categoryKey
          );
          const categoryName = categoryInfo?.name || categoryKey;

          return (
            <div
              key={categoryKey}
              id={categoryKey}
              ref={(el) => {
                sectionRefs.current[categoryKey] = el;
              }}
              className="mb-12"
            >
              {/* Category Title */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {categoryName}
                </h2>
                <div className="w-16 h-1 bg-green-600 rounded"></div>
              </div>

              {/* Food Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryFoods.map((food, index) => {
                  const imageUrl = getImageUrl(food.imageUrl);
                  
                  return (
                    <Card
                      key={food.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white"
                    >
                      {/* Image Section - Only render if image exists */}
                      {imageUrl ? (
                        <div className="relative h-50 w-full">
                          <img
                            src={imageUrl}
                            alt={food.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handleViewDetails(food)}
                            onError={(e) => {
                              // Hide image if it fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />

                          {/* Text Overlay on Image - Only bottom part */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col justify-end p-3 h-20">
                            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                              {food.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-lg">
                                {formatPrice(food.price)}
                              </span>
                              {food.original_price > 0 && (
                                <span className="text-gray-300 text-sm line-through">
                                  {formatPrice(food.original_price)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* View Details Button Overlay */}
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-2 right-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleViewDetails(food)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {food.is_popular && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {t("seating.popular")}
                            </Badge>
                          )}
                          {food.discount > 0 && (
                            <Badge className="absolute top-2 right-12 bg-red-500">
                              -{food.discount}%
                            </Badge>
                          )}
                          {!food.isThere && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                              <Badge variant="secondary">
                                {t("food.outOfStock")}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        // No image - show only text content - removed extra padding
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {food.is_popular && (
                              <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {t("seating.popular")}
                              </Badge>
                            )}
                            {food.discount > 0 && (
                              <Badge className="bg-red-500">
                                -{food.discount}%
                              </Badge>
                            )}
                            {!food.isThere && (
                              <Badge variant="secondary">
                                {t("food.outOfStock")}
                              </Badge>
                            )}
                          </div>

                          <h3 
                            className="font-semibold text-lg mb-2 line-clamp-1 cursor-pointer hover:text-green-600"
                            onClick={() => handleViewDetails(food)}
                          >
                            {food.name}
                          </h3>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-green-600">
                                {formatPrice(food.price)}
                              </span>
                              {food.original_price > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(food.original_price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Removed CardContent section completely to eliminate extra white space */}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {Object.keys(groupedFoods).length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("search.noResults")}
            </h3>
            <p className="text-gray-500">{t("search.noResultsDesc")}</p>
          </div>
        )}
      </div>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
}