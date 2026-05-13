'use client'

import { useState, useEffect } from 'react'
import { phones as phonesData } from '@/app/data'
import { initFirebase } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface Phone {
  id: string
  brand: string
  model: string
  storage: string
  color: string
  condition: string
  price: number
  imageUrl: string | null
  description: string | null
  available: boolean
}

const brandGradients: Record<string, string> = {
  Apple: 'from-gray-700 to-gray-900',
  Samsung: 'from-blue-600 to-indigo-800',
  Xiaomi: 'from-orange-500 to-red-600',
}

const brandLogos: Record<string, string> = {
  Apple: '🍎',
  Samsung: '📱',
  Xiaomi: '🤖',
}

export default function PhoneGallery() {
  const [phones, setPhones] = useState(phonesData)
  const [filter, setFilter] = useState('all')
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null)

  // Load phones from Firestore, fallback to static data
  useEffect(() => {
    try {
      const { db } = initFirebase()
      const q = query(collection(db, "gallery_phones"), orderBy("createdAt", "desc"))
      const unsub = onSnapshot(q, (snap) => {
        const fbPhones = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        if (fbPhones.length > 0) setPhones(fbPhones as Phone[])
      })
      return unsub
    } catch {}
  }, [])

  const filteredPhones = filter === 'all'
    ? phones
    : phones.filter((p) => p.brand === filter)

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Каталог
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Відновлені телефони
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Якісні відновлені пристрої за доступними цінами з гарантією
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">Всі</TabsTrigger>
              <TabsTrigger value="Apple">Apple</TabsTrigger>
              <TabsTrigger value="Samsung">Samsung</TabsTrigger>
              <TabsTrigger value="Xiaomi">Xiaomi</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPhones.map((phone, index) => (
              <motion.div
                key={phone.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
                  {/* Phone image / placeholder */}
                  <div
                    className={`relative h-48 bg-gradient-to-br ${
                      brandGradients[phone.brand] || 'from-gray-500 to-gray-700'
                    } flex items-center justify-center`}
                  >
                    {phone.imageUrl ? (
                      <img
                        src={phone.imageUrl}
                        alt={`${phone.brand} ${phone.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-white">
                        <span className="text-5xl block mb-2">{brandLogos[phone.brand] || '📱'}</span>
                        <span className="text-lg font-medium">{phone.brand}</span>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white/90">
                      {phone.condition}
                    </Badge>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {phone.brand} {phone.model}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {phone.storage}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {phone.color}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">
                        {phone.price.toLocaleString('uk-UA')} ₴
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPhone(phone)}
                        className="gap-1"
                      >
                        <Info className="w-3 h-3" />
                        Детальніше
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPhones.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Немає доступних телефонів у цій категорії</p>
          </div>
        )}

        {/* Phone Detail Dialog */}
        <Dialog open={!!selectedPhone} onOpenChange={(open) => !open && setSelectedPhone(null)}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedPhone && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {selectedPhone.brand} {selectedPhone.model}
                  </DialogTitle>
                  <DialogDescription>
                    Відновлений пристрій з гарантією
                  </DialogDescription>
                </DialogHeader>

                <div
                  className={`h-56 rounded-xl bg-gradient-to-br ${
                    brandGradients[selectedPhone.brand] || 'from-gray-500 to-gray-700'
                  } flex items-center justify-center`}
                >
                  {selectedPhone.imageUrl ? (
                    <img
                      src={selectedPhone.imageUrl}
                      alt={`${selectedPhone.brand} ${selectedPhone.model}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center text-white">
                      <span className="text-6xl block mb-2">{brandLogos[selectedPhone.brand] || '📱'}</span>
                      <span className="text-xl font-medium">{selectedPhone.brand} {selectedPhone.model}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{selectedPhone.condition}</Badge>
                    <Badge variant="secondary">{selectedPhone.storage}</Badge>
                    <Badge variant="secondary">{selectedPhone.color}</Badge>
                    {selectedPhone.available && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">В наявності</Badge>
                    )}
                  </div>

                  {selectedPhone.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedPhone.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-3xl font-bold text-primary">
                      {selectedPhone.price.toLocaleString('uk-UA')} ₴
                    </p>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Замовити
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
