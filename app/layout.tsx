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
    generator: 'v0.dev'
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
