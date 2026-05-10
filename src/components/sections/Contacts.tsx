'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
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
    title: 'Адрес',
    text: 'г. Киев, ул. Крещатик 22',
    subtext: 'м. Крещатик, 2 мин пешком',
  },
  {
    icon: Phone,
    title: 'Телефон',
    text: '+38 (044) 123-45-67',
    subtext: '+38 (067) 123-45-67',
  },
  {
    icon: Mail,
    title: 'Email',
    text: 'info@servicemaster.ua',
    subtext: 'Ответим в течение часа',
  },
  {
    icon: Clock,
    title: 'Время работы',
    text: 'Пн-Пт: 9:00 — 19:00',
    subtext: 'Сб: 10:00 — 16:00 | Вс: выходной',
  },
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: MessageCircle, label: 'Telegram', href: '#' },
  { icon: Phone, label: 'Viber', href: '#' },
  { icon: Phone, label: 'WhatsApp', href: '#' },
]

export default function Contacts() {
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      toast.error('Заполните все поля')
      return
    }

    setLoading(true)
    try {
      // Just simulate sending a contact form (could extend with an API)
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
      setFormName('')
      setFormEmail('')
      setFormMessage('')
    } catch {
      toast.error('Ошибка отправки. Попробуйте ещё раз.')
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
            Контакты
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Как нас найти
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Приезжайте к нам или свяжитесь любым удобным способом
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
              <p className="font-medium text-foreground mb-3">Мы в социальных сетях:</p>
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
            <div className="rounded-xl overflow-hidden h-80 lg:h-full min-h-[320px] shadow-lg">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=30.5100%2C50.4450%2C30.5250%2C50.4550&layer=mapnik&marker=50.4501%2C30.5175"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px' }}
                allowFullScreen
                loading="lazy"
                title="Карта расположения СервисМастер"
              />
            </div>
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
                Напишите нам
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Имя</Label>
                    <Input
                      id="contact-name"
                      placeholder="Ваше имя"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Сообщение</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Ваше сообщение..."
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
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить сообщение
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
