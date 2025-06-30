
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Get current language from localStorage (for non-hook contexts)
const getCurrentLanguage = () => {
  if (typeof window === 'undefined') return 'uz'
  try {
    const stored = localStorage.getItem('language-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.state?.language || 'uz'
    }
  } catch {
    // fallback if parsing fails
  }
  return 'uz'
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

// Complete table list
const ALL_TABLES: RestaurantTable[] = [
  // Zal-1
  { id: "93e05d01c3304b3b9dc963db187dbb51", name: "Stol-1", zone: "Zal-1", is_available: true },
  { id: "73d6827a734a43b6ad779b5979bb9c6a", name: "Stol-2", zone: "Zal-1", is_available: true },
  { id: "dc6e76e87f9e42a08a4e1198fc5f89a0", name: "Stol-3", zone: "Zal-1", is_available: true },
  { id: "70a53b0ac3264fce88d9a4b7d3a7fa5e", name: "Stol-4", zone: "Zal-1", is_available: true },
  { id: "3b8bfb57a10b4e4cb3b7a6d1434dd1bc", name: "Stol-5", zone: "Zal-1", is_available: true },
  { id: "4f0e0220e40b43b5a28747984474d6f7", name: "Stol-6", zone: "Zal-1", is_available: true },
  { id: "15fc7ed2ff3041aeaa52c5087e51f6b2", name: "Stol-7", zone: "Zal-1", is_available: true },
  { id: "41d0d60382b246469b7e01d70031c648", name: "Stol-8", zone: "Zal-1", is_available: true },
  { id: "539f421ed1974f55b86d09cfdace9ae3", name: "Stol-9", zone: "Zal-1", is_available: true },
  { id: "1ad401f487024d1ab78e1db90eb3ac18", name: "Stol-10", zone: "Zal-1", is_available: true },
  { id: "367f6587c09d4c1ebfe2b3e31c45b0ec", name: "Stol-11", zone: "Zal-1", is_available: true },
  { id: "da2a9f108bff460aa1b3149b8fa9ed2a", name: "Stol-12", zone: "Zal-1", is_available: true },
  { id: "91e91fa5a9e849aab850152b55613f98", name: "Stol-13", zone: "Zal-1", is_available: true },
  { id: "d6d2ee01a57f4f4e93e6788eb1ccf4b2", name: "Stol-14", zone: "Zal-1", is_available: true },
  { id: "b0f79bb99fef4492a26573f279845b9c", name: "Stol-15", zone: "Zal-1", is_available: true },
  { id: "c2b7aeef8e814a9c8dfc4935cf8392f6", name: "Stol-16", zone: "Zal-1", is_available: true },
  { id: "f4389cde50ac4c2ab4487a4a106d6d48", name: "Stol-17", zone: "Zal-1", is_available: true },

  // Zal-2
  { id: "c366a08ac9aa48d4a29f31de3561f69a", name: "Stol-1", zone: "Zal-2", is_available: true },
  { id: "d10a58dcb3cc4e3eb67a84f785a1a62d", name: "Stol-2", zone: "Zal-2", is_available: true },
  { id: "ecfc541124a54051b78e72930e1eac54", name: "Stol-3", zone: "Zal-2", is_available: true },
  { id: "e5baf1c7ed4d4a449fca1c7df1bb7006", name: "Stol-4", zone: "Zal-2", is_available: true },
  { id: "22bc7dbd17e145c6be40b1d01b29b16d", name: "Stol-5", zone: "Zal-2", is_available: true },
  { id: "ff6c4b82207f42a89b676ec5d0f1f7cc", name: "Stol-6", zone: "Zal-2", is_available: true },
  { id: "f00db03ddfa24d8b9f603a59cfb6f6cf", name: "Stol-7", zone: "Zal-2", is_available: true },
  { id: "f5c5bfa4a9974643b7a3aeb6d1114c7b", name: "Stol-8", zone: "Zal-2", is_available: true },
  { id: "62eb05a6882c401c953933132d43b7ff", name: "Stol-9", zone: "Zal-2", is_available: true },
  { id: "bb842ff325a8498a99414958c400bc62", name: "Stol-10", zone: "Zal-2", is_available: true },
  { id: "5ab7550a5ecf49b2b28faec156acbd44", name: "Stol-11", zone: "Zal-2", is_available: true },
  { id: "9d640accb3d94fcbad09c191f03a7f8e", name: "Stol-12", zone: "Zal-2", is_available: true },
  { id: "7a4044a32e2b4a35a9c91be98c3975a2", name: "Stol-13", zone: "Zal-2", is_available: true },
  { id: "9c45db6ccda54e989f8b0ebf12c0a34b", name: "Stol-14", zone: "Zal-2", is_available: true },
  { id: "f3fbbf2f179b4ec89745bfc3fdd10667", name: "Stol-15", zone: "Zal-2", is_available: true },
  { id: "42134cd30da04d5b9e37fc68f7913fc7", name: "Stol-16", zone: "Zal-2", is_available: true },

  // Terassa
  { id: "3066c1f1c2e640e5a7272e28b4d08f8e", name: "Terassa-1", zone: "Terassa", is_available: true },
  { id: "5932a6769b154a94b7dbbf646e3725a3", name: "Terassa-2", zone: "Terassa", is_available: true },
  { id: "bc1dce5a12d049a489f5aa6f7aa64b3c", name: "Terassa-3", zone: "Terassa", is_available: true },
  { id: "a30c8e82ab6843d898c487ae9a6f31f2", name: "Terassa-4", zone: "Terassa", is_available: true },
  { id: "fa8e703e17924a99b4496c96459ae1e7", name: "Terassa-5", zone: "Terassa", is_available: true },
  { id: "32575a40ab784b878888b1de5421c24f", name: "Terassa-6", zone: "Terassa", is_available: true },
  { id: "f4530dcf98854f92a49d64b71b7d1372", name: "Terassa-7", zone: "Terassa", is_available: true },
  { id: "93c931e153694f69a9fd404be85727de", name: "Terassa-8", zone: "Terassa", is_available: true },
  { id: "4be17f7c57964e689d536cc946925e02", name: "Terassa-9", zone: "Terassa", is_available: true },
  { id: "1ad9d8bbcc4e4b58b90ffed835f42e6b", name: "Terassa-10", zone: "Terassa", is_available: true },
  { id: "49045b8e013d4722a72a41e3a5b8a761", name: "Terassa-11", zone: "Terassa", is_available: true },
  { id: "f9a753a6bfc5483f9be02b36b3a021ae", name: "Terassa-12", zone: "Terassa", is_available: true },
  { id: "c4a91adbf5c545f0b5c2cd0732e429ef", name: "Terassa-13", zone: "Terassa", is_available: true },
  { id: "be6e16140c744418b47e021134a31b3f", name: "Terassa-14", zone: "Terassa", is_available: true },
  { id: "c3c2317de56f4f8da8fa4c758dfb0427", name: "Terassa-15", zone: "Terassa", is_available: true },
  { id: "76a5f6e3c08d4761b859ea0bb496fc63", name: "Terassa-16", zone: "Terassa", is_available: true },
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
    // Return the complete table list
    return ALL_TABLES
  },

  // Get single table by ID
  async getTableById(tableId: string): Promise<RestaurantTable | null> {
    const table = ALL_TABLES.find((t) => t.id === tableId)
    return table || null
  },
}
