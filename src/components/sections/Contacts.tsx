'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Clock,
  Send,
  Loader2,
  Instagram,
  MessageCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Адреса',
    text: 'м. Вознесенськ, Миколаївська обл., Центральний ринок, сектор Б, контейнер 96',
    subtext: '',
  },
  {
    icon: Phone,
    title: 'Телефон',
    text: '+38 (096) 077-71-11',
    subtext: '',
  },
  {
    icon: Clock,
    title: 'Графік роботи',
    text: 'Вт–Нд: 9:00 — 16:00',
    subtext: 'Пн: вихідний',
  },
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: MessageCircle, label: 'Telegram', href: '#' },
  { icon: Phone, label: 'Viber', href: '#' },
  { icon: Phone, label: 'WhatsApp', href: '#' },
]

const TG_TOKEN = '8670354731:AAF1gyLmL30HweAgC2VPbTkL2efXNlo8VkU'
const TG_CHAT_ID = 5651005104

function sendTG(text: string) {
  fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'HTML' })
  }).catch(() => {})
}

export default function Contacts() {
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formPhone.trim() || !formMessage.trim()) {
      toast.error('Заповніть всі поля')
      return
    }

    setLoading(true)
    try {
      // Just simulate sending a contact form (could extend with an API)
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Повідомлення надіслано! Я зв'яжуся з вами найближчим часом.")
      sendTG(
        `<b>📩 Нове повідомлення з сайту!</b>\n\n` +
        `<b>Ім'я:</b> ${formName}\n` +
        `<b>Телефон:</b> ${formPhone}\n` +
        `<b>Повідомлення:</b> ${formMessage}`
      )
      setFormName('')
      setFormPhone('')
      setFormMessage('')
    } catch {
      toast.error('Помилка надсилання. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacts" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Контакти
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Як нас знайти
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Приходьте або зв'яжіться зручним для вас способом
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{info.title}</p>
                      <p className="text-sm text-muted-foreground">{info.text}</p>
                      {info.subtext && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {info.subtext}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social media */}
            <div>
              <p className="font-medium text-foreground mb-3">Ми в соціальних мережах:</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=47.5627,31.3382"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden h-80 lg:h-full min-h-[320px] shadow-lg hover:shadow-xl transition-shadow group relative"
            >
              <iframe
                src="https://www.google.com/maps?q=47.5627,31.3382&hl=uk&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px', pointerEvents: 'none' }}
                allowFullScreen
                loading="lazy"
                title="Карта розташування"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center pb-3 pointer-events-none">
                <span className="bg-white/90 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  🗺️ Прокласти маршрут в Google Maps
                </span>
              </div>
            </a>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-center mb-6">
                Напишіть нам
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Ім'я</Label>
                    <Input
                      id="contact-name"
                      placeholder="Ваше ім'я"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Телефон</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+38 (0XX) XXX-XX-XX"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Повідомлення</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Ваше повідомлення..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Надсилання...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Надіслати повідомлення
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
