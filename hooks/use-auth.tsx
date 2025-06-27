
"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"

interface User {
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

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "INIT_AUTH"; payload: { user: User; token: string } | null }

const AuthContext = createContext<{
  state: AuthState
  login: (credentials: { number: string; password: string }) => Promise<void>
  register: (userData: {
    number: string
    password: string
    full_name: string
    email?: string
  }) => Promise<void>
  logout: () => void
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }

    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case "INIT_AUTH":
      if (action.payload) {
        return {
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
          isLoading: false,
        }
      } else {
        return {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }
      }

    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Initialize auth from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("auth_token")
        const userData = localStorage.getItem("auth_user")

        if (token && userData) {
          const user = JSON.parse(userData)
          dispatch({ type: "INIT_AUTH", payload: { user, token } })
        } else {
          dispatch({ type: "INIT_AUTH", payload: null })
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
        dispatch({ type: "INIT_AUTH", payload: null })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: { number: string; password: string }) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await api.login(credentials)

      // Get user profile
      const userProfile = await api.getProfile(response.token)

      const authData = {
        user: userProfile,
        token: response.token,
      }

      // Save to localStorage
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("auth_user", JSON.stringify(userProfile))

      dispatch({ type: "SET_USER", payload: authData })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const register = async (userData: {
    number: string
    password: string
    full_name: string
    email?: string
  }) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await api.register({
        ...userData,
        language: "uz",
      })

      // Get user profile
      const userProfile = await api.getProfile(response.token)

      const authData = {
        user: userProfile,
        token: response.token,
      }

      // Save to localStorage
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("auth_user", JSON.stringify(userProfile))

      dispatch({ type: "SET_USER", payload: authData })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        user: state.user,
        token: state.token,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
