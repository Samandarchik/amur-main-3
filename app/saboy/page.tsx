"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function SaboyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Saboy bo'limi</h1>
            <p className="text-gray-600 text-lg">Yangi va sifatli sabzavotlar</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="animate-fade-in-up animation-delay-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Saboy mahsulotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Bizning saboy bo'limida eng yangi va sifatli sabzavotlarni topishingiz mumkin.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Yangi sabzavotlar</li>
                  <li>• Organik mahsulotlar</li>
                  <li>• Har kuni yangi yetkazib berish</li>
                  <li>• Sifat kafolati</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-400">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Aloqa ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span>+ 998 94 700 07 70</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>Samarqand shahar, Kaftarcha</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>09:00 - 18:00</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild className="transform hover:scale-105 transition-all duration-200">
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                Bosh sahifaga qaytish
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
