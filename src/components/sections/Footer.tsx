'use client'

import { Wrench, Phone, Mail, MapPin, Instagram, MessageCircle, Heart } from 'lucide-react'

const navLinks = [
  { href: '#hero', label: 'Главная' },
  { href: '#calculator', label: 'Прайс-лист' },
  { href: '#gallery', label: 'Витрина' },
  { href: '#cases', label: 'Наши работы' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#blog', label: 'Блог' },
  { href: '#contacts', label: 'Контакты' },
]

const serviceLinks = [
  'Замена экрана',
  'Замена батареи',
  'Замена камеры',
  'Ремонт разъёма зарядки',
  'Восстановление после воды',
  'Бесплатная диагностика',
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: MessageCircle, label: 'Telegram', href: '#' },
  { icon: Phone, label: 'Viber', href: '#' },
  { icon: Phone, label: 'WhatsApp', href: '#' },
]

export default function Footer() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-white">
                Сервис<span className="text-primary">Мастер</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Профессиональный ремонт телефонов и продажа восстановленных устройств.
              Работаем с 2016 года. Более 12 000 выполненных ремонтов.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <span className="text-sm text-gray-400">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  г. Киев, ул. Крещатик 22
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <a
                    href="tel:+380441234567"
                    className="text-sm text-gray-400 hover:text-primary transition-colors block"
                  >
                    +38 (044) 123-45-67
                  </a>
                  <a
                    href="tel:+380671234567"
                    className="text-sm text-gray-400 hover:text-primary transition-colors block"
                  >
                    +38 (067) 123-45-67
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a
                  href="mailto:info@servicemaster.ua"
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  info@servicemaster.ua
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} СервисМастер. Все права защищены.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Сделано с <Heart className="w-3 h-3 text-red-400 fill-red-400" /> в Киеве
          </p>
        </div>
      </div>
    </footer>
  )
}
