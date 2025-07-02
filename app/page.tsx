"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { RestaurantSeating } from "@/components/featured-foods"
import { AboutSection } from "@/components/about-section"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { login, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    const redirect = searchParams.get("redirect")
    const phoneParam = searchParams.get("phone")
    const passwordParam = searchParams.get("password")
    const tableId = searchParams.get("table_id") // table_id parametrini olish

    // 1. Redirect logikasini boshqarish
    if (redirect === "saboy") {
      router.push("/saboy")
    } else if (redirect === "dastafka") {
      router.push("/dastafka")
    }

    // 2. Auto-login logikasi
    if (phoneParam && passwordParam && !isAuthenticated && !isLoading) {
      const attemptAutoLogin = async () => {
        try {
          console.log("Attempting auto-login with phone:", phoneParam);
          await login({ number: String(phoneParam), password: String(passwordParam) });
          console.log("Auto-login successful!");
          
          // Login muvaffaqiyatli bo'lgandan keyin table_id tekshiruvi
          if (tableId) {
            console.log("Table ID found after login, redirecting to table page:", tableId);
            router.push(`/${tableId}`);
          }
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      };
      attemptAutoLogin();
    } else if (tableId && isAuthenticated) {
      // Agar foydalanuvchi allaqachon tizimga kirgan bo'lsa va table_id mavjud bo'lsa
      console.log("Table ID found with authenticated user, redirecting to table page:", tableId);
      router.push(`/${tableId}`);
    }
  }, [searchParams, router, login, isAuthenticated, isLoading])

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* <Categories /> */}
      <RestaurantSeating />
      <AboutSection />
    </div>
  )
}