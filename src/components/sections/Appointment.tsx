'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Clock, MapPin, LogIn, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { initFirebase } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

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
  const { user, profile, loading, loginWithGoogle } = useAuth()
  const [question, setQuestion] = useState('')
  const [loading2, setLoading2] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) {
      toast.error('Напишіть ваше питання')
      return
    }

    setLoading2(true)
    try {
      // Save to Firestore
      const { db } = initFirebase()
      await addDoc(collection(db, "questions"), {
        userId: user?.uid || null,
        name: profile?.name || user?.displayName || "Користувач",
        email: profile?.email || user?.email || "",
        question: question.trim(),
        createdAt: Timestamp.now(),
      })

      // Send to Telegram
      sendTG(
        `<b>❓ Нове питання з сайту!</b>\n\n` +
        `<b>Ім'я:</b> ${profile?.name || user?.displayName || "Користувач"}\n` +
        `<b>Email:</b> ${profile?.email || user?.email || "—"}\n` +
        `<b>Питання:</b> ${question.trim()}`
      )

      toast.success('Питання надіслано! Я відповім вам найближчим часом.')
      setQuestion('')
    } catch {
      toast.error('Помилка. Спробуйте ще раз.')
    } finally {
      setLoading2(false)
    }
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
            Зв'язок
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Задати питання онлайн
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Відповім вам у будь-який вільний час
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

              {!user && !loading && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-5">
                    <p className="text-sm font-medium mb-3">Для надсилання питання — увійдіть</p>
                    <Button
                      onClick={() => loginWithGoogle()}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Увійти через Google
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Form — requires login */}
            <Card className="lg:col-span-3">
              <CardContent className="p-6 sm:p-8">
                {!user ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <LogIn className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Увійдіть, щоб задати питання</p>
                    <p className="text-sm mt-1">Це потрібно, щоб я знав кому відповідати</p>
                  </div>
                ) : (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 mb-6 p-3 bg-primary/5 rounded-lg">
                      {profile?.photoURL ? (
                        <img src={profile.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{profile?.name || "Користувач"}</p>
                        <p className="text-xs text-muted-foreground truncate">{profile?.email || user.email}</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="apt-question">Ваше питання *</Label>
                        <Textarea
                          id="apt-question"
                          placeholder="Напишіть ваше питання щодо ремонту, цін, запчастин..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={loading2}
                      >
                        {loading2 ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Надсилання...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Надіслати питання
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
