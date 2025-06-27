"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Footer() {
  const {t} = useLanguage()
  const handlePhoneCall = () => {
    window.location.href = "tel:+998901234567"
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl">{t('footer.logo')}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('hero.national')} {t('hero.xizmat')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="font-semibold text-lg mb-4">{t('footer.two')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('nav.menu')}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('orders.title')}
                </Link>
              </li>
              {/* <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Biz haqimizda
                </Link>
              </li> */}
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('hero.phone')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="font-semibold text-lg mb-4">{t('hero.phone')}</h3>
            <ul className="space-y-3">
              <li
                className="flex items-center space-x-2 cursor-pointer hover:text-orange-400 transition-colors duration-200"
                onClick={handlePhoneCall}
              >
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400">+ 998 94 700 07 70</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400">info@amur-restaurant.uz</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-orange-400 mt-1" />
                <span className="text-gray-400">Samarqand shahar, Kaftarcha</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="animate-fade-in-up animation-delay-600">
            <h3 className="font-semibold text-lg mb-4">{t('contact.hours')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400">{t('footer.one')}</span>
              </li>
              <li className="text-gray-400 ml-6">09:00 - 23:00</li>
              <li className="text-orange-400 text-sm mt-2">{t('footer.day')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2025 Amur Restorani. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  )
}
