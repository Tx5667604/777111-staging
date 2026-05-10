'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import OrderFormDialog from './OrderFormDialog'

interface RepairService {
  id: string
  brand: string
  model: string
  repairType: string
  basePartCost: number
  laborCost: number
  currency: string
  description: string | null
}

const brands = [
  { id: 'Apple', name: 'Apple', logo: '🍎' },
  { id: 'Samsung', name: 'Samsung', logo: '📱' },
  { id: 'Xiaomi', name: 'Xiaomi', logo: '🤖' },
  { id: 'Huawei', name: 'Huawei', logo: '📲' },
]

const repairTypes = [
  'Замена экрана',
  'Замена батареи',
  'Замена камеры',
  'Ремонт разъёма зарядки',
  'Замена кнопок',
  'Другое',
]

export default function PriceCalculator() {
  const [repairs, setRepairs] = useState<RepairService[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedRepairType, setSelectedRepairType] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)

  useEffect(() => {
    fetch('/api/repairs')
      .then((res) => res.json())
      .then(setRepairs)
      .catch(console.error)
  }, [])

  const models = repairs
    .filter((r) => r.brand === selectedBrand)
    .map((r) => r.model)
    .filter((v, i, a) => a.indexOf(v) === i)

  const selectedRepair = repairs.find(
    (r) =>
      r.brand === selectedBrand &&
      r.model === selectedModel &&
      r.repairType === selectedRepairType
  )

  const estimatedPrice = selectedRepair
    ? selectedRepair.basePartCost + selectedRepair.laborCost
    : selectedRepairType && selectedModel
    ? null
    : undefined

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId)
    setSelectedModel(null)
    setSelectedRepairType(null)
    setStep(2)
  }

  const handleModelSelect = (model: string) => {
    setSelectedModel(model)
    setSelectedRepairType(null)
    setStep(3)
  }

  const handleReset = () => {
    setSelectedBrand(null)
    setSelectedModel(null)
    setSelectedRepairType(null)
    setStep(1)
  }

  return (
    <section id="calculator" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Стоимость ремонта
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Калькулятор стоимости ремонта
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Выберите бренд, модель и тип ремонта, чтобы узнать примерную стоимость
          </p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= s
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 transition-all duration-300 ${
                    step > s ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Step 1: Brand Selection */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-center mb-6">
                  Выберите бренд устройства
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {brands.map((brand) => (
                    <motion.button
                      key={brand.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBrandSelect(brand.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                        selectedBrand === brand.id
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50 bg-card'
                      }`}
                    >
                      <span className="text-3xl">{brand.logo}</span>
                      <span className="font-medium text-foreground">{brand.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Model Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Назад
                  </Button>
                  <h3 className="text-lg font-semibold">
                    Выберите модель {selectedBrand}
                  </h3>
                  <div className="w-20" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {models.map((model) => (
                    <motion.button
                      key={model}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleModelSelect(model)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedModel === model
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50 bg-card'
                      }`}
                    >
                      <span className="font-medium text-foreground text-sm">{model}</span>
                    </motion.button>
                  ))}
                  {models.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      Нет доступных моделей для этого бренда
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Repair Type Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(2)}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Назад
                  </Button>
                  <h3 className="text-lg font-semibold">Выберите тип ремонта</h3>
                  <div className="w-20" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {repairTypes.map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedRepairType(type)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedRepairType === type
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50 bg-card'
                      }`}
                    >
                      <span className="font-medium text-foreground text-sm">{type}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Price result */}
                {selectedRepairType && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <Card className="border-primary/20 bg-gradient-to-br from-orange-50 to-amber-50">
                      <CardContent className="p-6 text-center">
                        <Calculator className="w-8 h-8 text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Стоимость ремонта {selectedBrand} {selectedModel} — {selectedRepairType}
                        </p>
                        {estimatedPrice !== undefined && estimatedPrice !== null ? (
                          <>
                            <p className="text-4xl font-bold text-primary mb-2">
                              {estimatedPrice.toLocaleString('ru-RU')} ₴
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                              <span>Запчасти: {selectedRepair!.basePartCost.toLocaleString('ru-RU')} ₴</span>
                              <span>•</span>
                              <span>Работа: {selectedRepair!.laborCost.toLocaleString('ru-RU')} ₴</span>
                            </div>
                            <Button
                              onClick={() => setOrderDialogOpen(true)}
                              size="lg"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                            >
                              Оформить заказ
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </>
                        ) : estimatedPrice === null ? (
                          <>
                            <p className="text-2xl font-bold text-primary mb-2">По запросу</p>
                            <p className="text-sm text-muted-foreground mb-6">
                              Точную стоимость уточнит мастер после диагностики
                            </p>
                            <Button
                              onClick={() => setOrderDialogOpen(true)}
                              size="lg"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                            >
                              Записаться на диагностику
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </>
                        ) : null}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset button */}
          {step > 1 && (
            <div className="text-center mt-6">
              <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
                Начать заново
              </Button>
            </div>
          )}
        </div>
      </div>

      <OrderFormDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        phoneModel={selectedBrand && selectedModel ? `${selectedBrand} ${selectedModel}` : ''}
        repairType={selectedRepairType || ''}
        estimatedPrice={estimatedPrice ?? undefined}
      />
    </section>
  )
}
