import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartProvider } from "@/providers/cart-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Amur Restorani - O'zbekistonning eng mazali taomları",
  description: "Amur restoranidan onlayn buyurtma bering. Tez yetkazib berish, sifatli taomlar va qulay narxlar.",
  openGraph: {
    title: "Amur Restorani - O'zbekistonning eng mazali taomları",
    description: "Amur restoranidan onlayn buyurtma bering. Tez yetkazib berish, sifatli taomlar va qulay narxlar.",
    images: [
      {
        url: "https://backend.amur1.uz/uploads/home_1750339092.png", // Rasm URL
        width: 1200,
        height: 630,
        alt: "Buyurtma berish",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html >
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
