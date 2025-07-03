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
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useSearchParams } from "next/navigation";
import { api, type Food, type Category } from "@/lib/api";
import { useLanguage } from "@/hooks/use-language";
import { CartSheet } from "@/components/cart/cart-sheet";

export default function MenuPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
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

  // Helper function to get category name by key
  const getCategoryNameByKey = (key: string) => {
    if (key === "all") return null;
    const category = categories.find((cat) => cat.key === key);
    return category ? category.name : null;
  };

  // Helper function to fix image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg?height=200&width=300";

    if (imageUrl.includes("localhost") || imageUrl.startsWith("http")) {
      const urlPath = imageUrl.replace(/^https?:\/\/[^\/]+/, "");
      return `https://uzjoylar-yoqj.onrender.com${urlPath}`;
    }

    return `https://uzjoylar-yoqj.onrender.com${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load categories
        const categoriesData = await api.getCategories();
        setCategories([
          { key: "all", name: t("categories.all") },
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

        // Don't filter by category in API call - we'll handle it locally for sections
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

        // Sort
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

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("sort.title")} />
            </SelectTrigger>
            <SelectContent>
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
                  const quantity = getItemQuantity(food.id);

                  return (
                    <Card
                      key={food.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white"
                    >
                      <div className="relative">
                        <img
                          src={getImageUrl(food.imageUrl)}
                          alt={food.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.svg?height=200&width=300";
                          }}
                        />

                        {food.is_popular && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Popular
                          </Badge>
                        )}
                        {food.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            -{food.discount}%
                          </Badge>
                        )}
                        {!food.isThere && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary">
                              {t("food.outOfStock")}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                          {food.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {food.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
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

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {food.rating} ({food.review_count})
                            </span>
                          </div>

                          {quantity === 0 ? (
                            <Button
                              size="sm"
                              disabled={!food.isThere}
                              onClick={() => handleAddItem(food)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                              {t("food.addToCart")}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 bg-green-600 rounded-lg p-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDecreaseItem(food.id)}
                                className="h-8 w-8 p-0 text-white hover:bg-green-700"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-semibold text-white min-w-[2rem] text-center">
                                {quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAddItem(food)}
                                className="h-8 w-8 p-0 text-white hover:bg-green-700"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
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

      {/* Cart */}
      <div className="fixed right-6 bottom-4">
        <Button
          size="icon"
          className="relative hover:scale-110 transition-transform duration-200"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Sheet */}
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
}
