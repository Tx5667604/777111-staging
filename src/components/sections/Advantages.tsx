'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, Clock, BadgePercent, Award, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const advantages = [
  {
    icon: Shield,
    title: 'Гарантия на все работы',
    description: 'Предоставляем гарантию от 6 до 12 месяцев на все виды ремонта и заменённые детали.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: CheckCircle,
    title: 'Оригинальные запчасти',
    description: 'Используем только оригинальные или сертифицированные аналоги от проверенных поставщиков.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Clock,
    title: 'Ремонт за 30 минут',
    description: 'Большинство ремонтов выполняется в присутствии клиента за 30–60 минут.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: BadgePercent,
    title: 'Доступные цены',
    description: 'Честное ценообразование без скрытых наценок. Цена, которую называют до начала ремонта.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Award,
    title: 'Опытные мастера',
    description: 'Наши специалисты имеют более 5 лет опыта и регулярно проходят сертификацию.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Search,
    title: 'Бесплатная диагностика',
    description: 'Определим проблему бесплатно, даже если вы решите не ремонтировать у нас.',
    color: 'bg-rose-50 text-rose-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Advantages() {
  return (
    <section id="advantages" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Почему мы
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Наши преимущества
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Мы делаем всё, чтобы вы остались довольны — от первого звонка до получения
            отремонтированного устройства
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {advantages.map((advantage, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${advantage.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <advantage.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
