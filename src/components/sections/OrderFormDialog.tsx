'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface OrderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneModel: string
  repairType: string
  estimatedPrice?: number
}

export default function OrderFormDialog({
  open,
  onOpenChange,
  phoneModel,
  repairType,
  estimatedPrice,
}: OrderFormDialogProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [model, setModel] = useState(phoneModel)
  const [issue, setIssue] = useState(repairType ? `Требуется: ${repairType}` : '')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !model.trim() || !issue.trim()) {
      toast.error('Пожалуйста, заполните все обязательные поля')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          phoneModel: model.trim(),
          issue: issue.trim(),
          imageUrl: imagePreview,
        }),
      })

      if (!res.ok) {
        throw new Error('Ошибка при создании заказа')
      }

      toast.success('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.')
      setName('')
      setPhone('')
      setModel(phoneModel)
      setIssue(repairType ? `Требуется: ${repairType}` : '')
      setImagePreview(null)
      onOpenChange(false)
    } catch {
      toast.error('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Оформить заявку на ремонт</DialogTitle>
          <DialogDescription>
            Заполните форму, и мы свяжемся с вами для подтверждения
          </DialogDescription>
        </DialogHeader>

        {estimatedPrice && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Ориентировочная стоимость:</p>
            <p className="text-xl font-bold text-primary">{estimatedPrice.toLocaleString('ru-RU')} ₴</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+38 (0XX) XXX-XX-XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Модель устройства *</Label>
            <Input
              id="model"
              placeholder="Например: iPhone 14"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue">Описание неисправности *</Label>
            <Textarea
              id="issue"
              placeholder="Опишите проблему..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Фото проблемы</Label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span className="text-sm">Загрузить фото</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
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
              'Отправить заявку'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
