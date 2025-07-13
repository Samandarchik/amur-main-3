import { useLanguage } from "@/hooks/use-language";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://uzjoylar-yoqj.onrender.com/api"

// Get current language from localStorage (for non-hook contexts)
const getCurrentLanguage = () => {
  if (typeof window === 'undefined') return 'ru'
  try {
    const stored = localStorage.getItem('language-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.state?.language || 'ru'
    }
  } catch {
    // fallback if parsing fails
  }
  return 'ru'
}

// Translation helper function for static contexts
const getTranslation = (key: string, lang?: string) => {
  const currentLang = lang || getCurrentLanguage()
  
  const translations: Record<string, Record<string, string>> = {
    'Stol-1': { uz: 'Stol-1', ru: 'Стол-1', en: 'Table-1' },
    'Stol-2': { uz: 'Stol-2', ru: 'Стол-2', en: 'Table-2' },
    'Stol-3': { uz: 'Stol-3', ru: 'Стол-3', en: 'Table-3' },
    'Stol-4': { uz: 'Stol-4', ru: 'Стол-4', en: 'Table-4' },
    'Stol-5': { uz: 'Stol-5', ru: 'Стол-5', en: 'Table-5' },
    'Stol-6': { uz: 'Stol-6', ru: 'Стол-6', en: 'Table-6' },
    'Stol-7': { uz: 'Stol-7', ru: 'Стол-7', en: 'Table-7' },
    'Stol-8': { uz: 'Stol-8', ru: 'Стол-8', en: 'Table-8' },
    'Stol-9': { uz: 'Stol-9', ru: 'Стол-9', en: 'Table-9' },
    'Stol-10': { uz: 'Stol-10', ru: 'Стол-10', en: 'Table-10' },
    'Stol-11': { uz: 'Stol-11', ru: 'Стол-11', en: 'Table-11' },
    'Stol-12': { uz: 'Stol-12', ru: 'Стол-12', en: 'Table-12' },
    'Stol-13': { uz: 'Stol-13', ru: 'Стол-13', en: 'Table-13' },
    'Stol-14': { uz: 'Stol-14', ru: 'Стол-14', en: 'Table-14' },
    'Stol-15': { uz: 'Stol-15', ru: 'Стол-15', en: 'Table-15' },
    'Stol-16': { uz: 'Stol-16', ru: 'Стол-16', en: 'Table-16' },
    'Stol-17': { uz: 'Stol-17', ru: 'Стол-17', en: 'Table-17' },
    'Zal-1': { uz: 'Zal-1', ru: 'Зал-1', en: 'Hall-1' },
    'Zal-2': { uz: 'Zal-2', ru: 'Зал-2', en: 'Hall-2' },
    'Terassa-1': { uz: 'Terassa-1', ru: 'Терраса-1', en: 'Terrace-1' },
    'Terassa-2': { uz: 'Terassa-2', ru: 'Терраса-2', en: 'Terrace-2' },
    'Terassa-3': { uz: 'Terassa-3', ru: 'Терраса-3', en: 'Terrace-3' },
    'Terassa-4': { uz: 'Terassa-4', ru: 'Терраса-4', en: 'Terrace-4' },
    'Terassa-5': { uz: 'Terassa-5', ru: 'Терраса-5', en: 'Terrace-5' },
    'Terassa-6': { uz: 'Terassa-6', ru: 'Терраса-6', en: 'Terrace-6' },
    'Terassa-7': { uz: 'Terassa-7', ru: 'Терраса-7', en: 'Terrace-7' },
    'Terassa-8': { uz: 'Terassa-8', ru: 'Терраса-8', en: 'Terrace-8' },
    'Terassa-9': { uz: 'Terassa-9', ru: 'Терраса-9', en: 'Terrace-9' },
    'Terassa-10': { uz: 'Terassa-10', ru: 'Терраса-10', en: 'Terrace-10' },
    'Terassa-11': { uz: 'Terassa-11', ru: 'Терраса-11', en: 'Terrace-11' },
    'Terassa-12': { uz: 'Terassa-12', ru: 'Терраса-12', en: 'Terrace-12' },
    'Terassa-13': { uz: 'Terassa-13', ru: 'Терраса-13', en: 'Terrace-13' },
    'Terassa-14': { uz: 'Terassa-14', ru: 'Терраса-14', en: 'Terrace-14' },
    'Terassa-15': { uz: 'Terassa-15', ru: 'Терраса-15', en: 'Terrace-15' },
    'Terassa-16': { uz: 'Terassa-16', ru: 'Терраса-16', en: 'Terrace-16' },
    'terrace': { uz: 'Terassa', ru: 'Терраса', en: 'Terrace' }
  }
  
  return translations[key]?.[currentLang] || key
}

// API response types
export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: string
  number: string
  role: string
  full_name: string
  email?: string
  created_at: string
  is_active: boolean
  tg_id?: number
  language: string
}

export interface Food {
  id: string
  names: {
    uz: string
    ru: string
    en: string
  }
  addToCart: string
  name: string
  descriptions: {
    uz: string
    ru: string
    en: string
  }
  description: string
  category: string
  category_name: string
  price: number
  original_price: number
  discount: number
  isThere: boolean
  imageUrl: string
  ingredients: {
    uz: string[]
    ru: string[]
    en: string[]
  }
  allergens: {
    uz: string[]
    ru: string[]
    en: string[]
  }
  rating: number
  review_count: number
  preparation_time: number
  stock: number
  is_popular: boolean
  comment: string
  created_at: string
  updated_at: string
}

export interface Category {
  key: string
  name: string
}

export interface OrderItem {
  food_id: string
  quantity: number
}

export interface DeliveryInfo {
  address?: string
  phone?: string
  latitude?: number
  longitude?: number
  table_id?: string
}

export interface CustomerInfo {
  name: string
  phone: string
  email?: string
}

export interface CreateOrderRequest {
  items: OrderItem[]
  delivery_type: "delivery" | "own_withdrawal" | "atTheRestaurant"
  delivery_info: DeliveryInfo
  payment_method: "cash" | "card" | "click" | "payme"
  special_instructions?: string
  customer_info: CustomerInfo
}

export interface Order {
  order_id: string
  user_number: string
  user_name: string
  foods: Array<{
    id: string
    name: string
    category: string
    price: number
    description: string
    imageUrl: string
    count: number
    total_price: number
  }>
  total_price: number
  order_time: string
  delivery_type: string
  delivery_info: {
    type: string
    address?: string
    phone?: string
    latitude?: number
    longitude?: number
    table_id?: string
  }
  status: string
  payment_info: {
    method: string
    status: string
    amount: number
  }
  special_instructions?: string
  estimated_time: number
  status_history: Array<{
    status: string
    timestamp: string
    note: string
  }>
  created_at: string
  updated_at: string
}

export interface CreateOrderResponse {
  order: Order
  message: string
  estimated_time: number
  order_tracking: string
}

export interface RestaurantTable {
  id: string
  name: string
  zone: string
  is_available: boolean
}

// Static tables - will be dynamically translated when needed
const createTables = () => [
  // Zal-1
  { id: "93e05d01c3304b3b9dc963db187dbb51", name: getTranslation("Stol-1"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "73d6827a734a43b6ad779b5979bb9c6a", name: getTranslation("Stol-2"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "dc6e76e87f9e42a08a4e1198fc5f89a0", name: getTranslation("Stol-3"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "70a53b0ac3264fce88d9a4b7d3a7fa5e", name: getTranslation("Stol-4"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "3b8bfb57a10b4e4cb3b7a6d1434dd1bc", name: getTranslation("Stol-5"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "4f0e0220e40b43b5a28747984474d6f7", name: getTranslation("Stol-6"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "15fc7ed2ff3041aeaa52c5087e51f6b2", name: getTranslation("Stol-7"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "41d0d60382b246469b7e01d70031c648", name: getTranslation("Stol-8"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "539f421ed1974f55b86d09cfdace9ae3", name: getTranslation("Stol-9"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "1ad401f487024d1ab78e1db90eb3ac18", name: getTranslation("Stol-10"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "367f6587c09d4c1ebfe2b3e31c45b0ec", name: getTranslation("Stol-11"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "da2a9f108bff460aa1b3149b8fa9ed2a", name: getTranslation("Stol-12"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "91e91fa5a9e849aab850152b55613f98", name: getTranslation("Stol-13"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "d6d2ee01a57f4f4e93e6788eb1ccf4b2", name: getTranslation("Stol-14"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "b0f79bb99fef4492a26573f279845b9c", name: getTranslation("Stol-15"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "c2b7aeef8e814a9c8dfc4935cf8392f6", name: getTranslation("Stol-16"), zone: getTranslation("Zal-1"), is_available: true },
  { id: "f4389cde50ac4c2ab4487a4a106d6d48", name: getTranslation("Stol-17"), zone: getTranslation("Zal-1"), is_available: true },

  // Zal-2
  { id: "c366a08ac9aa48d4a29f31de3561f69a", name: getTranslation("Stol-1"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "d10a58dcb3cc4e3eb67a84f785a1a62d", name: getTranslation("Stol-2"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "ecfc541124a54051b78e72930e1eac54", name: getTranslation("Stol-3"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "e5baf1c7ed4d4a449fca1c7df1bb7006", name: getTranslation("Stol-4"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "22bc7dbd17e145c6be40b1d01b29b16d", name: getTranslation("Stol-5"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "ff6c4b82207f42a89b676ec5d0f1f7cc", name: getTranslation("Stol-6"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "f00db03ddfa24d8b9f603a59cfb6f6cf", name: getTranslation("Stol-7"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "f5c5bfa4a9974643b7a3aeb6d1114c7b", name: getTranslation("Stol-8"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "62eb05a6882c401c953933132d43b7ff", name: getTranslation("Stol-9"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "bb842ff325a8498a99414958c400bc62", name: getTranslation("Stol-10"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "5ab7550a5ecf49b2b28faec156acbd44", name: getTranslation("Stol-11"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "9d640accb3d94fcbad09c191f03a7f8e", name: getTranslation("Stol-12"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "7a4044a32e2b4a35a9c91be98c3975a2", name: getTranslation("Stol-13"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "9c45db6ccda54e989f8b0ebf12c0a34b", name: getTranslation("Stol-14"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "f3fbbf2f179b4ec89745bfc3fdd10667", name: getTranslation("Stol-15"), zone: getTranslation("Zal-2"), is_available: true },
  { id: "42134cd30da04d5b9e37fc68f7913fc7", name: getTranslation("Stol-16"), zone: getTranslation("Zal-2"), is_available: true },

  // Terassa
  { id: "3066c1f1c2e640e5a7272e28b4d08f8e", name: getTranslation("Terassa-1"), zone: getTranslation("terrace"), is_available: true },
  { id: "5932a6769b154a94b7dbbf646e3725a3", name: getTranslation("Terassa-2"), zone: getTranslation("terrace"), is_available: true },
  { id: "bc1dce5a12d049a489f5aa6f7aa64b3c", name: getTranslation("Terassa-3"), zone: getTranslation("terrace"), is_available: true },
  { id: "a30c8e82ab6843d898c487ae9a6f31f2", name: getTranslation("Terassa-4"), zone: getTranslation("terrace"), is_available: true },
  { id: "fa8e703e17924a99b4496c96459ae1e7", name: getTranslation("Terassa-5"), zone: getTranslation("terrace"), is_available: true },
  { id: "32575a40ab784b878888b1de5421c24f", name: getTranslation("Terassa-6"), zone: getTranslation("terrace"), is_available: true },
  { id: "f4530dcf98854f92a49d64b71b7d1372", name: getTranslation("Terassa-7"), zone: getTranslation("terrace"), is_available: true },
  { id: "93c931e153694f69a9fd404be85727de", name: getTranslation("Terassa-8"), zone: getTranslation("terrace"), is_available: true },
  { id: "4be17f7c57964e689d536cc946925e02", name: getTranslation("Terassa-9"), zone: getTranslation("terrace"), is_available: true },
  { id: "1ad9d8bbcc4e4b58b90ffed835f42e6b", name: getTranslation("Terassa-10"), zone: getTranslation("terrace"), is_available: true },
  { id: "49045b8e013d4722a72a41e3a5b8a761", name: getTranslation("Terassa-11"), zone: getTranslation("terrace"), is_available: true },
  { id: "f9a753a6bfc5483f9be02b36b3a021ae", name: getTranslation("Terassa-12"), zone: getTranslation("terrace"), is_available: true },
  { id: "c4a91adbf5c545f0b5c2cd0732e429ef", name: getTranslation("Terassa-13"), zone: getTranslation("terrace"), is_available: true },
  { id: "be6e16140c744418b47e021134a31b3f", name: getTranslation("Terassa-14"), zone: getTranslation("terrace"), is_available: true },
  { id: "c3c2317de56f4f8da8fa4c758dfb0427", name: getTranslation("Terassa-15"), zone: getTranslation("terrace"), is_available: true },
  { id: "76a5f6e3c08d4761b859ea0bb496fc63", name: getTranslation("Terassa-16"), zone: getTranslation("terrace"), is_available: true },
]

// API functions
export const api = {
  // Authentication
  async login(credentials: { number: string; password: string }): Promise<{
    token: string
    role: string
    user_id: string
    language: string
  }> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Login failed")
    }

    return response.json()
  },

  async register(userData: {
    number: string
    password: string
    full_name: string
    email?: string
    tg_id?: number
    language?: string
  }): Promise<{
    token: string
    role: string
    user_id: string
    language: string
  }> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Registration failed")
    }

    return response.json()
  },

  async getProfile(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch profile")
    }

    return response.json()
  },

  // Get all foods
  async getFoods(params?: {
    category?: string
    search?: string
    popular?: boolean
    sort?: string
    page?: number
    limit?: number
  }): Promise<{ foods: Food[]; pagination: any }> {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append("category", params.category)
    if (params?.search) searchParams.append("search", params.search)
    if (params?.popular) searchParams.append("popular", "true")
    if (params?.sort) searchParams.append("sort", params.sort)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const response = await fetch(`${API_BASE_URL}/foods?${searchParams}`, {
      headers: {
        "Accept-Language": getCurrentLanguage(),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch foods")
    }

    return response.json()
  },

  // Get single food
  async getFood(id: string): Promise<Food> {
    const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
      headers: {
        "Accept-Language": getCurrentLanguage(),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch food")
    }

    return response.json()
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        "Accept-Language": getCurrentLanguage(),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    return response.json()
  },

  // Search foods
  async searchFoods(params: {
    q: string
    category?: string
    min_price?: number
    max_price?: number
    min_rating?: number
  }): Promise<{
    query: string
    language: string
    results: Food[]
    total: number
    filters: any
  }> {
    const searchParams = new URLSearchParams()
    searchParams.append("q", params.q)
    if (params.category) searchParams.append("category", params.category)
    if (params.min_price) searchParams.append("min_price", params.min_price.toString())
    if (params.max_price) searchParams.append("max_price", params.max_price.toString())
    if (params.min_rating) searchParams.append("min_rating", params.min_rating.toString())

    const response = await fetch(`${API_BASE_URL}/search?${searchParams}`, {
      headers: {
        "Accept-Language": getCurrentLanguage(),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to search foods")
    }

    return response.json()
  },

  // Create order
  async createOrder(orderData: CreateOrderRequest, token?: string): Promise<CreateOrderResponse> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || "Failed to create order"
      throw new Error(
        `${errorMessage}. Sent data: ${JSON.stringify(orderData, null, 2)}`
      )
    }

    return response.json()
  },

  // Get user orders
  async getUserOrders(
    params?: {
      status?: string
      page?: number
      limit?: number
    },
    token?: string,
  ): Promise<{
    orders: Order[]
    pagination: any
  }> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const headers: HeadersInit = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders?${searchParams}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch orders")
    }

    return response.json()
  },

  // Get order by ID
  async getOrder(orderId: string, token?: string): Promise<Order> {
    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch order")
    }

    return response.json()
  },

  // Track order (public)
  async trackOrder(orderId: string): Promise<{
    order_id: string
    status: string
    estimated_time: number
    remaining_time: number
    elapsed_time: number
    order_time: string
    status_history: Array<{
      status: string
      timestamp: string
      note: string
    }>
  }> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/track`)

    if (!response.ok) {
      throw new Error("Failed to track order")
    }

    return response.json()
  },

  // Get restaurant tables
  async getRestaurantTables(): Promise<RestaurantTable[]> {
    // Return dynamically created tables with current language
    return createTables()
  },

  // Get single table by ID
  async getTableById(tableId: string): Promise<RestaurantTable | null> {
    const tables = createTables()
    const table = tables.find((t) => t.id === tableId)
    return table || null
  },
}