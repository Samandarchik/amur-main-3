"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Language = "uz" | "ru" | "en"

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: {
    "verify_location_first_button": "Joylashuvni tekshirish",

    "location_too_far_description": "Sizning joylashuvingiz Amur Restoranidan juda uzoqda.",
    "location_verification_title": "Joylashuvni tasdiqlash",
    "location_verification_required_title": "Joylashuvni tasdiqlash talab qilinadi",
    "verify_location_button": "Joylashuvni tasdiqlash",
    "location_too_far_title": "Joylashuv juda uzoq",
    "location_too_far_detailed_description": "Sizning joylashuvingiz Amur Restoranidan juda uzoqda.",
    "distance_away": "Masofa: {{distance}} m",
    "need_to_be_closer": "Siz Amur Restoraniga yaqinroq bo'lishingiz kerak.",
    "Zal-1": "Zal-1",
    "Zal-2": "Zal-2",
    "Stol-1": "Stol-1",
    "Stol-2": "Stol-2",
    "Stol-3": "Stol-3",
    "Stol-4": "Stol-4",
    "Stol-5": "Stol-5",
    "Stol-6": "Stol-6",
    "Stol-7": "Stol-7",
    "Stol-8": "Stol-8",
    "Stol-9": "Stol-9",
    "Stol-10": "Stol-10",
    "Stol-11": "Stol-11",
    "Stol-12": "Stol-12",
    "Stol-13": "Stol-13",
    "Stol-14": "Stol-14",
    "Stol-15": "Stol-15",
    "Stol-16": "Stol-16",
    "Stol-17": "Stol-17",
    "Stol-18": "Stol-18",
    "Stol-19": "Stol-19",
    "Stol-20": "Stol-20",
    "terrace": "Terrace",
    "Terassa-1": "Terassa-1",
    "Terassa-2": "Terassa-2",
    "Terassa-3": "Terassa-3",
    "Terassa-4": "Terassa-4",
    "Terassa-5": "Terassa-5",
    "Terassa-6": "Terassa-6",
    "Terassa-7": "Terassa-7",
    "Terassa-8": "Terassa-8",
    "Terassa-9": "Terassa-9",
    "Terassa-10": "Terassa-10",
    "Terassa-11": "Terassa-11",
    "Terassa-12": "Terassa-12",
    "Terassa-13": "Terassa-13",
    "Terassa-14": "Terassa-14",
    "Terassa-15": "Terassa-15",
    "Terassa-16": "Terassa-16",
    

    // Navigation
    "nav.home": "Bosh sahifa",
    "nav.menu": "Menyu",
    "nav.checkout": "To'lov",
    "nav.orders": "Buyurtmalar",
    "nav.tables": "Stollar",
    "nav.delivery": "Yetkazib berish",
    "nav.about": "Biz haqimizda",
    "nav.contact": "Aloqa",
    "nav.cart": "Savat",

    // Hero
    "hero.title": "Amur Restoraniga Xush Kelibsiz",
    "hero.subtitle": "Eng mazali taomlar va tez yetkazib berish xizmati",
    "hero.orderNow": "Buyurtma berish",
    "hero.learnMore": "Batafsil",
    "hero.xizmat": "sifatli xizmat kafolati bilan",
    "hero.national": "O'zbekistonning eng mazali milliy taomlarini buyurtma qiling.",
    "hero.minute": "daqiqa",
    "hero.map": "Joylashuv",
    "hero.phone": "Aloqa",

    // About
    "about.one": "Nega Amur Restorani?",

    // Categories
    "categories.title": "Taom turlari",
    "categories.items": "ta mahsulot",
    "categories.all": "Barchasi",

    // Featured
    "featured.title": "Mashhur taomlar",

    // Food
    "food.addToCart": "Savatga qo'shish",
    "food.viewDetails": "Batafsil ko'rish",
    "food.price": "Narx",
    "food.available": "Mavjud",
    "food.unavailable": "Mavjud emas",
    "food.lowStock": "Kam qoldi",
    "food.outOfStock": "Tugagan",
    "food.rating": "Reyting",
    "food.description": "Ta'rif",
    "food.ingredients": "Ingredientlar",
    "food.minutes": "daqiqa",

    // Search & Sort
    "search.placeholder": "Taom qidirish...",
    "search.noResults": "Hech narsa topilmadi",
    "sort.title": "Saralash",
    "sort.name": "Nom bo'yicha",
    "sort.priceLow": "Arzon narx",
    "sort.priceHigh": "Qimmat narx",
    "sort.rating": "Reyting bo'yicha",

    // Cart
    "cart.title": "Savat",
    "cart.empty": "Savat bo'sh",
    "cart.total": "Jami",
    "cart.checkout": "To'lash",
    "cart.continue": "Xarid davom etish",
    "cart.remove": "O'chirish",
    "cart.quantity": "Miqdor",
    "cart.subtotal": "Oraliq jami",
    "cart.delivery": "Yetkazib berish",
    "cart.tax": "Soliq",
    "cart.add": "Savatga qo'shish",

    // Orders
    "orders.title": "Buyurtmalar",
    "orders.status": "Holat",
    "orders.pending": "Kutilmoqda",
    "orders.preparing": "Tayyorlanmoqda",
    "orders.ready": "Tayyor",
    "orders.delivered": "Yetkazildi",
    "orders.cancelled": "Bekor qilindi",
    "orders.track": "Kuzatish",
    "orders.orderNumber": "Buyurtma raqami",
    "orders.orderDate": "Buyurtma sanasi",
    "orders.totalAmount": "Umumiy summa",

    // Tables
    "tables.title": "Stollar",
    "tables.available": "Bo'sh",
    "tables.occupied": "Band",
    "tables.reserved": "Bron qilingan",
    "tables.book": "Bron qilish",
    "tables.capacity": "Sig'im",

    // Delivery
    "delivery.title": "Yetkazib berish",
    "delivery.address": "Manzil",
    "delivery.phone": "Telefon",
    "delivery.time": "Vaqt",
    "delivery.free": "Bepul yetkazib berish",
    "delivery.cost": "Yetkazib berish narxi",

    // About
    "about.title": "Biz haqimizda",
    "about.description": "Biz sifatli taomlar va professional xizmat ko'rsatishga ixtisoslashganmiz",
    "about.fastDelivery": "Tez yetkazib berish",
    "about.fastDeliveryDesc": "30 daqiqada yetkazib beramiz",
    "about.gpsTracking": "GPS kuzatuv",
    "about.gpsTrackingDesc": "Buyurtmangizni real vaqtda kuzating",
    "about.support": "24/7 qo'llab-quvvatlash",
    "about.supportDesc": "Har doim sizning xizmatingizdamiz",

    // Contact
    "contact.title": "Biz bilan bog'laning",
    "contact.description": "Savollaringiz bormi? Biz bilan bog'laning!",
    "contact.getInTouch": "Aloqa ma'lumotlari",
    "contact.sendMessage": "Xabar yuborish",
    "contact.address": "Manzil",
    "contact.phone": "Telefon",
    "contact.email": "Email",
    "contact.hours": "Ish vaqti",
    "contact.name": "Ismingiz",
    "contact.subject": "Mavzu",
    "contact.message": "Xabaringiz",
    "contact.send": "Yuborish",

    // Auth
    "auth.login": "Kirish",
    "auth.register": "Ro'yxatdan o'tish",
    "auth.logout": "Chiqish",
    "auth.email": "Email",
    "auth.password": "Parol",
    "auth.confirmPassword": "Parolni tasdiqlang",
    "auth.forgotPassword": "Parolni unutdingizmi?",

    // Common
    "common.loading": "Yuklanmoqda...",
    "common.error": "Xatolik yuz berdi",
    "common.success": "Muvaffaqiyatli",
    "common.cancel": "Bekor qilish",
    "common.save": "Saqlash",
    "common.edit": "Tahrirlash",
    "common.delete": "O'chirish",
    "common.confirm": "Tasdiqlash",
    "common.back": "Orqaga",
    "common.next": "Keyingi",
    "common.previous": "Oldingi",
    "common.close": "Yopish",

    // Footer
    "footer.one": "Dushanba - Yakshanba",
    "footer.two": "Tezkor havolalar",
    "footer.logo": "Amur Restorani",
    "footer.day": "Har kuni ish",

    // Seating Areas
    "seating.title": "Restoran Joylari",
    "seating.subtitle": "Har xil tadbirlar uchun qulay o'tirish joylari",
    "seating.popular": "Mashhur",
    "seating.premium": "Premium",
    "seating.free": "Bepul",
    "seating.booking": "Bron qilish",
    "seating.call": "Qo'ng'iroq",
    "seating.telegram": "Telegram",
    "seating.bookingAlert": "uchun bron qilish oynasi ochiladi",

    // Seating Area Names
    "seating.zal1.name": "Zal-1",
    "seating.zal1.description": "Asosiy zal, oilaviy va do'stlar bilan dam olish uchun",
    "seating.zal1.capacity": "20-30 kishi",

    "seating.zal2.name": "Zal-2",
    "seating.zal2.description": "Kichik tadbirlar va muhim uchrashuvlar uchun",
    "seating.zal2.capacity": "15-20 kishi",

    "seating.terrace.name": "Terassa",
    "seating.terrace.description": "Ochiq havoda dam olish, tabiat bilan birga",
    "seating.terrace.capacity": "25-35 kishi",

    "seating.vip.name": "VIP Zal",
    "seating.vip.description": "Maxsus tadbirlar va muhim mehmonlar uchun",
    "seating.vip.capacity": "10-15 kishi",

    // Seating Features
    "seating.features.ac": "Konditsioner",
    "seating.features.wifi": "Wi-Fi",
    "seating.features.music": "Musiqa tizimi",
    "seating.features.projector": "Proyektor",
    "seating.features.special": "Maxsus xizmat",
    "seating.features.outdoor": "Ochiq havo",
    "seating.features.view": "Manzara",
    "seating.features.bbq": "Barbekyu zonasi",
    "seating.features.private": "Alohida kirish",
    "seating.features.premium": "Premium xizmat",
    "seating.features.menu": "Maxsus menyu",

    // Currency
    currency: "so'm",
  },
  ru: {
    "verify_location_first_button": "Проверить местоположение",
    "location_too_far_description": "Ваше местоположение слишком далеко от ресторана Amur.",
        "location_verification_title": "Подтверждение местоположения",
    "location_verification_required_title": "Требуется подтверждение местоположения",
    "verify_location_button": "Подтвердить местоположение",
    "location_too_far_title": "Местоположение слишком далеко",
    "location_too_far_detailed_description": "Ваше местоположение слишком далеко от ресторана Amur.",
    "distance_away": "Расстояние: {{distance}} м",
    "need_to_be_closer": "Вам нужно быть ближе к ресторану Amur.",
        "Zal-1": "Зал-1",
    "Zal-2": "Зал-2",
    "Stol-1": "Стол-1",
    "Stol-2": "Стол-2",
    "Stol-3": "Стол-3",
    "Stol-4": "Стол-4",
    "Stol-5": "Стол-5",
    "Stol-6": "Стол-6",
    "Stol-7": "Стол-7",
    "Stol-8": "Стол-8",
    "Stol-9": "Стол-9",
    "Stol-10": "Стол-10",
    "Stol-11": "Стол-11",
    "Stol-12": "Стол-12",
    "Stol-13": "Стол-13",
    "Stol-14": "Стол-14",
    "Stol-15": "Стол-15",
    "Stol-16": "Стол-16",
    "Stol-17": "Стол-17",
    "Stol-18": "Стол-18",
    "Stol-19": "Стол-19",
    "Stol-20": "Стол-20",
    "terrace": "Терраса",
    "Terassa-1": "Терраса-1",
    "Terassa-2": "Терраса-2",
    "Terassa-3": "Терраса-3",
    "Terassa-4": "Терраса-4",
    "Terassa-5": "Терраса-5",
    "Terassa-6": "Терраса-6",
    "Terassa-7": "Терраса-7",
    "Terassa-8": "Терраса-8",
    "Terassa-9": "Терраса-9",
    "Terassa-10": "Терраса-10",
    "Terassa-11": "Терраса-11",
    "Terassa-12": "Терраса-12",
    "Terassa-13": "Терраса-13",
    "Terassa-14": "Терраса-14",
    "Terassa-15": "Терраса-15",
    "Terassa-16": "Терраса-16",
    // Navigation
    "nav.home": "Главная",
    "nav.menu": "Меню",
    "nav.checkout": "Оплата",
    "nav.orders": "Заказы",
    "nav.tables": "Столы",
    "nav.delivery": "Доставка",
    "nav.about": "О нас",
    "nav.contact": "Контакты",
    "nav.cart": "Корзина",

    // Hero
    "hero.title": "Добро пожаловать в Amur",
    "hero.subtitle": "Самые вкусные блюда и быстрая доставка",
    "hero.orderNow": "Заказать",
    "hero.learnMore": "Подробнее",
    "hero.national": "Закажите самые вкусные национальные блюда Узбекистана.",
    "hero.xizmat": "с гарантией качественного обслуживания",
    "hero.minute": "минута",
    "hero.map": "расположение",
    "hero.phone": "контакт",

    // Categories
    "categories.title": "Категории блюд",
    "categories.items": "блюд",
    "categories.all": "Все",

    // Featured
    "featured.title": "Популярные блюда",

    // Food
    "food.addToCart": "В корзину",
    "food.price": "Цена",
    "food.viewDetails": "Посмотреть детали",
    "food.available": "Доступно",
    "food.unavailable": "Недоступно",
    "food.lowStock": "Мало осталось",
    "food.outOfStock": "Нет в наличии",
    "food.rating": "Рейтинг",
    "food.description": "Описание",
    "food.ingredients": "Ингредиенты",
    "food.minutes": "мин",

    // Search & Sort
    "search.placeholder": "Поиск блюд...",
    "search.noResults": "Ничего не найдено",
    "sort.title": "Сортировка",
    "sort.name": "По названию",
    "sort.priceLow": "Дешевые",
    "sort.priceHigh": "Дорогие",
    "sort.rating": "По рейтингу",

    // Cart
    "cart.title": "Корзина",
    "cart.empty": "Корзина пуста",
    "cart.total": "Итого",
    "cart.checkout": "Оформить заказ",
    "cart.continue": "Продолжить покупки",
    "cart.remove": "Удалить",
    "cart.quantity": "Количество",
    "cart.subtotal": "Промежуточный итог",
    "cart.delivery": "Доставка",
    "cart.tax": "Налог",
    "cart.add": "Добавить в корзину",


    // Orders
    "orders.title": "Заказы",
    "orders.status": "Статус",
    "orders.pending": "Ожидает",
    "orders.preparing": "Готовится",
    "orders.ready": "Готов",
    "orders.delivered": "Доставлен",
    "orders.cancelled": "Отменен",
    "orders.track": "Отследить",
    "orders.orderNumber": "Номер заказа",
    "orders.orderDate": "Дата заказа",
    "orders.totalAmount": "Общая сумма",

    // Tables
    "tables.title": "Столы",
    "tables.available": "Свободен",
    "tables.occupied": "Занят",
    "tables.reserved": "Забронирован",
    "tables.book": "Забронировать",
    "tables.capacity": "Вместимость",

    // Delivery
    "delivery.title": "Доставка",
    "delivery.address": "Адрес",
    "delivery.phone": "Телефон",
    "delivery.time": "Время",
    "delivery.free": "Бесплатная доставка",
    "delivery.cost": "Стоимость доставки",

    // About
    "about.title": "О нас",
    "about.description": "Мы специализируемся на качественных блюдах и профессиональном обслуживании",
    "about.fastDelivery": "Быстрая доставка",
    "about.fastDeliveryDesc": "Доставляем за 30 минут",
    "about.gpsTracking": "GPS отслеживание",
    "about.gpsTrackingDesc": "Отслеживайте заказ в реальном времени",
    "about.support": "Поддержка 24/7",
    "about.supportDesc": "Всегда к вашим услугам",
    "about.one": "Почему ресторан «Амур»?",

    // Contact
    "contact.title": "Свяжитесь с нами",
    "contact.description": "Есть вопросы? Свяжитесь с нами!",
    "contact.getInTouch": "Контактная информация",
    "contact.sendMessage": "Отправить сообщение",
    "contact.address": "Адрес",
    "contact.phone": "Телефон",
    "contact.email": "Email",
    "contact.hours": "Время работы",
    "contact.name": "Ваше имя",
    "contact.subject": "Тема",
    "contact.message": "Ваше сообщение",
    "contact.send": "Отправить",

    // Footer
    "footer.one": "Понедельник - Воскресенье",
    "footer.two": "Быстрые ссылки",
    "footer.logo": "Ресторан Амур",
    "footer.day": "Работаем каждый день",

    // Auth
    "auth.login": "Войти",
    "auth.register": "Регистрация",
    "auth.logout": "Выйти",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.confirmPassword": "Подтвердите пароль",
    "auth.forgotPassword": "Забыли пароль?",

    // Common
    "common.loading": "Загрузка...",
    "common.error": "Произошла ошибка",
    "common.success": "Успешно",
    "common.cancel": "Отмена",
    "common.save": "Сохранить",
    "common.edit": "Редактировать",
    "common.delete": "Удалить",
    "common.confirm": "Подтвердить",
    "common.back": "Назад",
    "common.next": "Далее",
    "common.previous": "Предыдущий",
    "common.close": "Закрыть",

    // Seating Areas
    "seating.title": "Места в ресторане",
    "seating.subtitle": "Удобные места для различных мероприятий",
    "seating.popular": "Популярный",
    "seating.premium": "Премиум",
    "seating.free": "Бесплатно",
    "seating.booking": "Бронирование",
    "seating.call": "Звонок",
    "seating.telegram": "Telegram",
    "seating.bookingAlert": "откроется окно бронирования для",

    // Seating Area Names
    "seating.zal1.name": "Зал-1",
    "seating.zal1.description": "Основной зал для семейного отдыха и встреч с друзьями",
    "seating.zal1.capacity": "20-30 человек",

    "seating.zal2.name": "Зал-2",
    "seating.zal2.description": "Для небольших мероприятий и важных встреч",
    "seating.zal2.capacity": "15-20 человек",

    "seating.terrace.name": "Терраса",
    "seating.terrace.description": "Отдых на свежем воздухе, наедине с природой",
    "seating.terrace.capacity": "25-35 человек",

    "seating.vip.name": "VIP Зал",
    "seating.vip.description": "Для особых мероприятий и важных гостей",
    "seating.vip.capacity": "10-15 человек",

    // Seating Features
    "seating.features.ac": "Кондиционер",
    "seating.features.wifi": "Wi-Fi",
    "seating.features.music": "Музыкальная система",
    "seating.features.projector": "Проектор",
    "seating.features.special": "Особое обслуживание",
    "seating.features.outdoor": "На свежем воздухе",
    "seating.features.view": "Вид",
    "seating.features.bbq": "Зона барбекю",
    "seating.features.private": "Отдельный вход",
    "seating.features.premium": "Премиум обслуживание",
    "seating.features.menu": "Особое меню",

    // Currency
    currency: "сум",
  },
  en: {
    "verify_location_first_button": "Verify Location",
        "location_verification_title": "Location Verification",
    "location_verification_required_title": "Your location is required",
    "verify_location_button": "Verify Location",
    "location_too_far_title": "Your location is too far",
    "location_too_far_detailed_description": "Your location is too far from Amur Restaurant.",
    "distance_away": "Distance: {{distance}} m",
    "location_too_far_description": "Your location is too far from Amur Restaurant.",
    "need_to_be_closer":"You need to be closer to Amur Restaurant.",
     "Zal-1": "Hall-1",
    "Zal-2": "Hall-2",
    "Stol-1": "Table-1",
    "Stol-2": "Table-2",
    "Stol-3": "Table-3",
    "Stol-4": "Table-4",
    "Stol-5": "Table-5",
    "Stol-6": "Table-6",
    "Stol-7": "Table-7",
    "Stol-8": "Table-8",
    "Stol-9": "Table-9",
    "Stol-10": "Table-10",
    "Stol-11": "Table-11",
    "Stol-12": "Table-12",
    "Stol-13": "Table-13",
    "Stol-14": "Table-14",
    "Stol-15": "Table-15",
    "Stol-16": "Table-16",
    "Stol-17": "Table-17",
    "Stol-18": "Table-18",
    "Stol-19": "Table-19",
    "Stol-20": "Table-20",
      "terrace": "Terrace",
  "Terassa-1": "Terrace-1",
  "Terassa-2": "Terrace-2",
  "Terassa-3": "Terrace-3",
  "Terassa-4": "Terrace-4",
  "Terassa-5": "Terrace-5",
  "Terassa-6": "Terrace-6",
  "Terassa-7": "Terrace-7",
  "Terassa-8": "Terrace-8",
  "Terassa-9": "Terrace-9",
  "Terassa-10": "Terrace-10",
  "Terassa-11": "Terrace-11",
  "Terassa-12": "Terrace-12",
  "Terassa-13": "Terrace-13",
  "Terassa-14": "Terrace-14",
  "Terassa-15": "Terrace-15",
  "Terassa-16": "Terrace-16",

    // Navigation
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.checkout": "Checkout",
    "nav.orders": "Orders",
    "nav.tables": "Tables",
    "nav.delivery": "Delivery",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.cart": "Cart",

    // Hero
    "hero.title": "Welcome to Amur Restaurant",
    "hero.subtitle": "Delicious food and fast delivery service",
    "hero.orderNow": "Order Now",
    "hero.learnMore": "Learn More",
    "hero.national": "Order the most delicious national dishes of Uzbekistan.",
    "hero.xizmat": "with a guarantee of quality service",
    "hero.minute": "minute",
    "hero.map": "location",
    "hero.phone": "contact",

    // Categories
    "categories.title": "Food Categories",
    "categories.items": "items",
    "categories.all": "All",

    // Featured
    "featured.title": "Featured Foods",

    // Food
    "food.addToCart": "Add to Cart",
    "food.price": "Price",
    "food.viewDetails": "View Details",
    "food.available": "Available",
    "food.unavailable": "Unavailable",
    "food.lowStock": "Low Stock",
    "food.outOfStock": "Out of Stock",
    "food.rating": "Rating",
    "food.description": "Description",
    "food.ingredients": "Ingredients",
    "food.minutes": "min",

    // Search & Sort
    "search.placeholder": "Search foods...",
    "search.noResults": "No results found",
    "sort.title": "Sort by",
    "sort.name": "Name",
    "sort.priceLow": "Price: Low to High",
    "sort.priceHigh": "Price: High to Low",
    "sort.rating": "Rating",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.continue": "Continue Shopping",
    "cart.remove": "Remove",
    "cart.quantity": "Quantity",
    "cart.subtotal": "Subtotal",
    "cart.delivery": "Delivery",
    "cart.tax": "Tax",
    "cart.add": "Add to cart",

    // Orders
    "orders.title": "Orders",
    "orders.status": "Status",
    "orders.pending": "Pending",
    "orders.preparing": "Preparing",
    "orders.ready": "Ready",
    "orders.delivered": "Delivered",
    "orders.cancelled": "Cancelled",
    "orders.track": "Track",
    "orders.orderNumber": "Order Number",
    "orders.orderDate": "Order Date",
    "orders.totalAmount": "Total Amount",

    // Tables
    "tables.title": "Tables",
    "tables.available": "Available",
    "tables.occupied": "Occupied",
    "tables.reserved": "Reserved",
    "tables.book": "Book",
    "tables.capacity": "Capacity",

    // Delivery
    "delivery.title": "Delivery",
    "delivery.address": "Address",
    "delivery.phone": "Phone",
    "delivery.time": "Time",
    "delivery.free": "Free delivery",
    "delivery.cost": "Delivery cost",

    // About
    "about.title": "About Us",
    "about.description": "We specialize in quality food and professional service",
    "about.fastDelivery": "Fast Delivery",
    "about.fastDeliveryDesc": "We deliver in 30 minutes",
    "about.gpsTracking": "GPS Tracking",
    "about.gpsTrackingDesc": "Track your order in real-time",
    "about.support": "24/7 Support",
    "about.supportDesc": "Always at your service",
    "about.one": "Why Amur Restaurant?",

    // Contact
    "contact.title": "Contact Us",
    "contact.description": "Have questions? Get in touch with us!",
    "contact.getInTouch": "Get in Touch",
    "contact.sendMessage": "Send Message",
    "contact.address": "Address",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.hours": "Working Hours",
    "contact.name": "Your Name",
    "contact.subject": "Subject",
    "contact.message": "Your Message",
    "contact.send": "Send",

    // Footer
    "footer.one": "Monday - Sunday",
    "footer.two": "Quick links",
    "footer.logo": "Amur Restaurant",
    "footer.day": "Work every day",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot Password?",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.close": "Close",

    // Seating Areas
    "seating.title": "Restaurant Seating",
    "seating.subtitle": "Comfortable seating areas for various events",
    "seating.popular": "Popular",
    "seating.premium": "Premium",
    "seating.free": "Free",
    "seating.booking": "Booking",
    "seating.call": "Call",
    "seating.telegram": "Telegram",
    "seating.bookingAlert": "booking window will open for",

    // Seating Area Names
    "seating.zal1.name": "Hall-1",
    "seating.zal1.description": "Main hall for family and friends gatherings",
    "seating.zal1.capacity": "20-30 people",

    "seating.zal2.name": "Hall-2",
    "seating.zal2.description": "For small events and important meetings",
    "seating.zal2.capacity": "15-20 people",

    "seating.terrace.name": "Terrace",
    "seating.terrace.description": "Outdoor relaxation, close to nature",
    "seating.terrace.capacity": "25-35 people",

    "seating.vip.name": "VIP Hall",
    "seating.vip.description": "For special events and important guests",
    "seating.vip.capacity": "10-15 people",

    // Seating Features
    "seating.features.ac": "Air Conditioning",
    "seating.features.wifi": "Wi-Fi",
    "seating.features.music": "Music System",
    "seating.features.projector": "Projector",
    "seating.features.special": "Special Service",
    "seating.features.outdoor": "Outdoor",
    "seating.features.view": "View",
    "seating.features.bbq": "BBQ Zone",
    "seating.features.private": "Private Entrance",
    "seating.features.premium": "Premium Service",
    "seating.features.menu": "Special Menu",

    // Currency
    currency: "UZS",
  },
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: "ru",
      setLanguage: (language) => set({ language }),
      t: (key) => {
        const { language } = get()
        return (translations as any)[language][key] || key
      },
    }),
    {
      name: "language-storage",
    },
  ),
)
