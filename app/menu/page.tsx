"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ShoppingCart,
  Flame,
  Timer,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useSearchParams } from "next/navigation";
import { api, type Food, type Category } from "@/lib/api";
import { useLanguage } from "@/hooks/use-language";
import { CartSheet } from "@/components/cart/cart-sheet";
import { FoodDetailModal } from "./detail_page";

export default function MenuPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  // Detail Modal States
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { addItem, removeItem, items } = useCart();
  const { language, t } = useLanguage();
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Helper to get item quantity from cart items
  const getItemQuantity = (id: string) => {
    const item = items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const searchParams = useSearchParams();

  // Helper function to fix image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg?height=200&width=300";

    if (imageUrl.includes("localhost") || imageUrl.startsWith("http")) {
      const urlPath = imageUrl.replace(/^https?:\/\/[^\/]+/, "");
      return `https://backend.amur1.uz${urlPath}`;
    }

    return `https://backend.amur1.uz${imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl}`;
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

  // Handle URL category parameter
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && categories.some((cat) => cat.key === category)) {
      setSelectedCategory(category);
    }
  }, [searchParams, categories]);

  // Filter foods based on search and sort
  useEffect(() => {
    const filterAndSort = async () => {
      try {
        const params: any = {
          page: 1,
          limit: 100,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }
        if (sortBy !== "id") {
          params.sort = sortBy;
        }

        const foodsData = await api.getFoods(params);
        setFilteredFoods(foodsData.foods);
      } catch (error) {
        console.error("Failed to filter foods:", error);
        let filtered = foods;

        if (searchQuery) {
          filtered = filtered.filter(
            (food) =>
              food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              food.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        switch (sortBy) {
          case "price_asc":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "name":
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "id":
          default:
            filtered.sort((a, b) => a.id.localeCompare(b.id));
            break;
        }

        setFilteredFoods(filtered);
      }
    };

    if (foods.length > 0) {
      filterAndSort();
    }
  }, [foods, searchQuery, sortBy]);

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

  const handleAddItem = (food: Food) => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      imageUrl: food.imageUrl,
      category: food.category_name,
    });
  };

  const handleDecreaseItem = (foodId: string) => {
    const currentQuantity = getItemQuantity(foodId);
    if (currentQuantity > 1) {
      const item = items.find((item) => item.id === foodId);
      if (item) {
        removeItem(foodId);
        for (let i = 0; i < currentQuantity - 1; i++) {
          addItem(item);
        }
      }
    } else {
      removeItem(foodId);
    }
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
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sticky Category Navigation */}
        <div
          ref={categoryNavRef}
          className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToCategory(category.key)}
                  className={`whitespace-nowrap px-6 py-3 rounded-full transition-all duration-300 font-semibold ${selectedCategory === category.key
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
                    }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500/20 shadow-sm"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-52 py-3 rounded-xl border-gray-200 focus:border-green-500 shadow-sm">
                <SelectValue placeholder={t("sort.title")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="price_asc">{t("sort.priceLow")}</SelectItem>
                <SelectItem value="price_desc">{t("sort.priceHigh")}</SelectItem>
                <SelectItem value="rating">{t("sort.rating")}</SelectItem>
                <SelectItem value="name">{t("sort.name")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
                className="mb-16"
              >
                {/* Category Title */}
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {categoryName}
                  </h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                </div>

                {/* Food Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryFoods.map((food) => {
                    const imageUrl = getImageUrl(food.imageUrl);
                    const quantity = getItemQuantity(food.id);

                    return (
                      <Card
                        key={food.id}
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white rounded-2xl border-0 shadow-lg hover:shadow-green-500/20 min-w-0"
                      >
                        {/* Image Section */}
                        {imageUrl ? (
                          <>
                            <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                              <img
                                src={imageUrl}
                                alt={food.name}
                                className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110"
                                onClick={() => handleViewDetails(food)}
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=300";
                                  console.log(`Failed to load image for ${food.name}: ${imageUrl}`);
                                }}
                              />

                              {/* Top Badges */}
                              <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {food.is_popular && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                                    <Flame className="h-3 w-3" />
                                    {t("seating.popular")}
                                  </div>
                                )}
                                {food.discount > 0 && (
                                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-bold">
                                    -{food.discount}%
                                  </div>
                                )}
                              </div>

                              {/* Out of Stock Overlay */}
                              {!food.isThere && (
                                <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm">
                                  <div className="bg-white/95 text-gray-800 px-4 py-2 rounded-xl font-semibold shadow-lg">
                                    {t("food.outOfStock")}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Text Section Below Image */}
                            <div className="p-4">
                              <h3
                                className="font-bold h-[63px] text-lg mb-2 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors duration-200"
                                onClick={() => handleViewDetails(food)}
                              >
                                {food.name}
                              </h3>

                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xl text-green-600">
                                    {formatPrice(food.price)}
                                  </span>
                                  {food.original_price > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatPrice(food.original_price)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Add to Cart Button */}
                              {quantity === 0 ? (
                                <button
                                  onClick={() => handleAddItem(food)}
                                  disabled={!food.isThere}
                                  className="w-full flex items-center justify-center px-1 py-2 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="h-4 w-4 inline-block mr-2" />
                                  <p className="hidden md:block">{t("cart.add")}</p>
                                </button>
                              ) : (
                                <div className="flex items-center justify-between px-1 py-1 bg-green-600 rounded-xl shadow-md">
                                  <button
                                    onClick={() => handleDecreaseItem(food.id)}
                                    className="px-2 text-white hover:bg-white/20 rounded-full transition-all duration-200"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="text-white font-bold text-lg mx-4">{quantity}</span>
                                  <button
                                    onClick={() => {
                                      if (quantity < food.stock) {
                                        handleAddItem(food);
                                      }
                                    }}
                                    disabled={quantity >= food.stock}
                                    className="px-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          /* No Image Layout */
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              {food.is_popular && (
                                <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full">
                                  <Flame className="h-3 w-3" />
                                  {t("seating.popular")}
                                </div>
                              )}
                              {food.discount > 0 && (
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                                  -{food.discount}%
                                </div>
                              )}
                              {!food.isThere && (
                                <div className="bg-gray-500 text-white text-xs px-3 py-1.5 rounded-full">
                                  {t("food.outOfStock")}
                                </div>
                              )}
                            </div>

                            <h3
                              className="font-bold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors duration-200"
                              onClick={() => handleViewDetails(food)}
                            >
                              {food.name}
                            </h3>

                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xl text-green-600">
                                  {formatPrice(food.price)}
                                </span>
                                {food.original_price > 0 && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(food.original_price)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Add to Cart Button */}
                            {quantity === 0 ? (
                              <button
                                onClick={() => handleAddItem(food)}
                                disabled={!food.isThere}
                                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="h-4 w-4 inline-block mr-2" />
                                {t("cart.add")}
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-1 shadow-lg">
                                <button
                                  onClick={() => handleDecreaseItem(food.id)}
                                  className="p-1.5 text-white hover:bg-white/20 rounded transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-white font-bold min-w-[2rem] text-center text-sm">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => {
                                    if (quantity < food.stock) {
                                      handleAddItem(food);
                                    }
                                  }}
                                  disabled={quantity >= food.stock}
                                  className="p-1.5 text-white hover:bg-white/20 rounded transition-colors disabled:opacity-50"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {Object.keys(groupedFoods).length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-6">
                <Filter className="h-20 w-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t("search.noResults")}
              </h3>
              <p className="text-gray-600 text-lg">{t("search.noResultsDesc")}</p>
            </div>
          )}
        </div>

        {/* Floating Cart Button */}
        <div className="fixed right-6 bottom-6 z-50">
          <Button
            size="lg"
            className="relative hover:scale-110 transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-2xl rounded-full p-4"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg">
                {totalItems}
              </div>
            )}
          </Button>
        </div>

        {/* Cart Sheet */}
        <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />

        {/* Food Detail Modal */}
        <FoodDetailModal
          food={selectedFood}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      </div>
    </>
  );
}