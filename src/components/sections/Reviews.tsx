'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Review {
  id: string
  author: string
  text: string
  rating: number
  date: string
  avatarUrl: string | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)

  if (reviews.length === 0) return null

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Отзывы
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Отзывы наших клиентов
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Мнение наших клиентов — лучшая рекомендация нашей работы
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-8 sm:p-10">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />

                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(reviews[currentIndex].author)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {reviews[currentIndex].author}
                      </p>
                      <StarRating rating={reviews[currentIndex].rating} />
                    </div>
                  </div>

                  <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                    &ldquo;{reviews[currentIndex].text}&rdquo;
                  </p>

                  <p className="text-sm text-muted-foreground/70">
                    {new Date(reviews[currentIndex].date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              disabled={reviews.length <= 1}
              aria-label="Предыдущий отзыв"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Отзыв ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              disabled={reviews.length <= 1}
              aria-label="Следующий отзыв"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
