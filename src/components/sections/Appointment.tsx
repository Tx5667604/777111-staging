'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Loader2, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
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

export default function Appointment() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [issue, setIssue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date || !time) {
      toast.error('Заповніть всі обов\u2019язкові поля')
      return
    }

    setLoading(true)
    setTimeout(() => {
      toast.success('Ви записані на прийом! Я підтверджу запис за телефоном.')
      sendTG(
        `<b>📅 Новий запис на ремонт!</b>\n\n` +
        `<b>Ім'я:</b> ${name}\n` +
        `<b>Телефон:</b> ${phone}\n` +
        `<b>Дата:</b> ${date}\n` +
        `<b>Час:</b> ${time}\n` +
        `<b>Проблема:</b> ${issue || 'не вказано'}`
      )
      setName('')
      setPhone('')
      setDate('')
      setTime('')
      setIssue('')
      setLoading(false)
    }, 1500)
  }

  return (
    <section id="appointment" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Запис
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Запишіться на ремонт онлайн
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Оберіть зручний час, і я підготуюсь до вашого візиту
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Info cards */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Години роботи</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Вт–Нд: 9:00 — 16:00<br />
                      Пн: вихідний
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Адреса</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      м. Вознесенськ, Миколаївська обл., Центральний ринок, сектор Б, контейнер 96
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Як записатися</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Заповніть форму, оберіть дату та час. Я підтверджу запис за телефоном.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <Card className="lg:col-span-3">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apt-name">Ім'я *</Label>
                      <Input
                        id="apt-name"
                        placeholder="Ваше ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apt-phone">Телефон *</Label>
                      <Input
                        id="apt-phone"
                        type="tel"
                        placeholder="+38 (0XX) XXX-XX-XX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apt-date">Дата *</Label>
                      <Input
                        id="apt-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Время *</Label>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              time === slot
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apt-issue">Опис проблеми</Label>
                    <Textarea
                      id="apt-issue"
                      placeholder="Опишіть проблему з вашим пристроєм..."
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      rows={3}
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
                        <CalendarCheck className="w-4 h-4 mr-2" />
                        Записатися на прийом
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
