// src/app/admin/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { initFirebase } from "@/lib/firebase"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Users,
  Calculator,
  ShoppingCart,
  Search,
  Trash2,
  Plus,
  Edit3,
  X,
  Check,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Save,
  Upload,
  Download,
} from "lucide-react"
import { brandPartsData } from "@/app/phone-parts-data"
import type { PartVariant, BrandParts, PartCategory } from "@/app/types"
import { PART_CATEGORIES } from "@/app/types"

const ADMIN_EMAIL = "fit5667604@gmail.com"

// ========== Helpers ==========
const TG_TOKEN = '8670354731:AAF1gyLmL30HweAgC2VPbTkL2efXNlo8VkU'
const TG_CHAT_ID = 5651005104

function sendTG(text: string) {
  fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'HTML' })
  }).catch(() => {})
}

// ========== Users Tab ==========
function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const { db } = initFirebase()
    const q = query(collection(db, "users"), orderBy("lastLogin", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const filtered = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").includes(search)
  )

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Пошук клієнта..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} клієнтів</p>
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Клієнтів не знайдено</p>}
      {filtered.map((u) => (
        <Card key={u.id} className="hover:shadow-md transition-shadow mb-2">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">{(u.name || "?").charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-1">
              <p className="text-sm font-medium truncate">{u.name || "—"}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{u.email || "—"}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{u.phone || "—"}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{u.lastLogin ? new Date(u.lastLogin.seconds * 1000 || u.lastLogin).toLocaleDateString("uk-UA") : "—"}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ========== Calculator Editor Tab ==========
function CalculatorTab() {
  const [brands, setBrands] = useState<any[]>([])
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null)
  const [editingModel, setEditingModel] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState("")

  useEffect(() => {
    // Load from static data and merge with Firestore
    loadData()
  }, [])

  const loadData = async () => {
    const { db } = initFirebase()
    const snap = await getDocs(collection(db, "calculator_brands"))
    const fbBrands: any[] = []
    snap.forEach((d) => fbBrands.push({ id: d.id, ...d.data() }))

    if (fbBrands.length === 0) {
      // First time — seed from static file
      setBrands(brandPartsData)
    } else {
      // Merge: Firestore overrides static data
      const merged = brandPartsData.map((staticBrand) => {
        const fb = fbBrands.find((b: any) => b.id === staticBrand.id)
        return fb || staticBrand
      })
      // Add brands that only exist in Firestore
      fbBrands.forEach((fb: any) => {
        if (!merged.find((m) => m.id === fb.id)) merged.push(fb)
      })
      setBrands(merged)
    }
  }

  const seedToFirestore = async () => {
    setSaving(true)
    setStatusMsg("Завантаження даних у Firestore...")
    const { db } = initFirebase()
    const batch = writeBatch(db)

    for (const brand of brandPartsData) {
      const ref = doc(db, "calculator_brands", brand.id)
      batch.set(ref, { name: brand.name, logo: brand.logo, models: brand.models, updatedAt: Timestamp.now() })
    }
    await batch.commit()
    setStatusMsg(`${brandPartsData.length} брендів завантажено!`)
    setTimeout(() => setStatusMsg(""), 2000)
    setSaving(false)
    loadData()
  }

  const saveBrand = async (brandId: string, updatedModels: any[]) => {
    setSaving(true)
    const { db } = initFirebase()
    await setDoc(doc(db, "calculator_brands", brandId), {
      id: brandId,
      name: brands.find((b) => b.id === brandId)?.name || brandId,
      logo: brands.find((b) => b.id === brandId)?.logo || "📱",
      models: updatedModels,
      updatedAt: Timestamp.now(),
    }, { merge: true })
    setSaving(false)
  }

  const handleModelEdit = (brandId: string, modelIndex: number, field: string, value: any) => {
    setBrands((prev) =>
      prev.map((b) => {
        if (b.id !== brandId) return b
        const updatedModels = [...b.models]
        updatedModels[modelIndex] = { ...updatedModels[modelIndex], [field]: value }
        return { ...b, models: updatedModels }
      })
    )
  }

  const handleModelSave = async (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId)
    if (!brand) return
    await saveBrand(brandId, brand.models)
    setEditingModel(null)
  }

  const addModel = (brandId: string) => {
    setBrands((prev) =>
      prev.map((b) => {
        if (b.id !== brandId) return b
        const newModel = {
          modelCode: "NEW",
          modelName: "Нова модель",
          parts: {
            display: { copy: 300, orig: 500, labor: 200 },
            battery: { copy: 150, orig: 250, labor: 150 },
            back_cover: { copy: 100, orig: 200, labor: 100 },
            speaker: { price: 100, labor: 100 },
          },
        }
        return { ...b, models: [...b.models, newModel] }
      })
    )
  }

  const deleteModel = async (brandId: string, modelIndex: number) => {
    const brand = brands.find((b) => b.id === brandId)
    if (!brand) return
    const updatedModels = brand.models.filter((_: any, i: number) => i !== modelIndex)
    setBrands((prev) => prev.map((b) => (b.id === brandId ? { ...b, models: updatedModels } : b)))
    await saveBrand(brandId, updatedModels)
  }

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Пошук бренду..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <p className="text-sm text-muted-foreground">{brands.length} брендів</p>
        <Button variant="outline" size="sm" onClick={seedToFirestore} disabled={saving}>
          <Upload className="w-4 h-4 mr-1" />
          Завантажити в Firestore
        </Button>
        {statusMsg && <span className="text-sm text-green-600">{statusMsg}</span>}
      </div>

      {filteredBrands.length === 0 && <p className="text-center text-muted-foreground py-8">Брендів не знайдено</p>}

      {filteredBrands.map((brand) => (
        <Card key={brand.id} className="mb-2">
          <button
            onClick={() => setExpandedBrand(expandedBrand === brand.id ? null : brand.id)}
            className="w-full text-left p-4 flex items-center gap-3 hover:bg-accent/30 transition-colors"
          >
            {expandedBrand === brand.id ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
            <span className="text-lg">{brand.logo}</span>
            <span className="font-medium">{brand.name}</span>
            <span className="text-sm text-muted-foreground">({brand.models?.length || 0} моделей)</span>
          </button>

          {expandedBrand === brand.id && (
            <CardContent className="pt-0 pb-4 px-4">
              <div className="flex items-center gap-2 mb-3">
                <Button size="sm" variant="outline" onClick={() => addModel(brand.id)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Модель
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium pr-2">Модель</th>
                      <th className="pb-2 font-medium px-2">Назва</th>
                      <th className="pb-2 font-medium px-2">Дисплей</th>
                      <th className="pb-2 font-medium px-2">АКБ</th>
                      <th className="pb-2 font-medium px-2">Зад. кришка</th>
                      <th className="pb-2 font-medium px-2">Спікер</th>
                      <th className="pb-2 font-medium px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {brand.models.map((model: any, idx: number) => {
                      const isEditing = editingModel === `${brand.id}-${idx}`
                      const p = model.parts || {}
                      return (
                        <tr key={idx} className="border-b hover:bg-muted/20">
                          <td className="py-1.5 pr-2">
                            {isEditing ? (
                              <Input value={model.modelCode} onChange={(e) => handleModelEdit(brand.id, idx, "modelCode", e.target.value)} className="h-7 text-xs w-20" />
                            ) : (
                              <span className="font-mono text-[11px]">{model.modelCode}</span>
                            )}
                          </td>
                          <td className="py-1.5 px-2">
                            {isEditing ? (
                              <Input value={model.modelName} onChange={(e) => handleModelEdit(brand.id, idx, "modelName", e.target.value)} className="h-7 text-xs w-36" />
                            ) : (
                              <span className="max-w-[120px] truncate block">{model.modelName}</span>
                            )}
                          </td>
                          <td className="py-1.5 px-2 text-muted-foreground">
                            {p.display ? `${p.display[0]?.price || p.display.copy || "?"}₴` : "—"}
                          </td>
                          <td className="py-1.5 px-2 text-muted-foreground">
                            {p.battery ? `${p.battery[0]?.price || p.battery.copy || "?"}₴` : "—"}
                          </td>
                          <td className="py-1.5 px-2 text-muted-foreground">
                            {p.back_cover ? `${p.back_cover[0]?.price || p.back_cover.copy || "?"}₴` : "—"}
                          </td>
                          <td className="py-1.5 px-2 text-muted-foreground">{p.speaker ? `${p.speaker.price || "?"}₴` : "—"}</td>
                          <td className="py-1.5">
                            <div className="flex items-center gap-1">
                              {isEditing ? (
                                <>
                                  <button onClick={() => handleModelSave(brand.id)} className="p-1 hover:bg-green-100 rounded"><Check className="w-3 h-3 text-green-600" /></button>
                                  <button onClick={() => setEditingModel(null)} className="p-1 hover:bg-red-50 rounded"><X className="w-3 h-3 text-red-400" /></button>
                                </>
                              ) : (
                                <button onClick={() => setEditingModel(`${brand.id}-${idx}`)} className="p-1 hover:bg-accent rounded"><Edit3 className="w-3 h-3 text-muted-foreground" /></button>
                              )}
                              <button onClick={() => deleteModel(brand.id, idx)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-400" /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

// ========== Orders Tab ==========
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const { db } = initFirebase()
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const filtered = orders.filter(
    (o) =>
      (o.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.phone || "").includes(search) ||
      (o.items || []).some((i: any) => i.name?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Пошук замовлення..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} замовлень</p>
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Замовлень ще немає</p>}
      {filtered.map((order) => (
        <Card key={order.id} className="mb-2">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium">{order.name || "—"}</p>
                <p className="text-sm text-muted-foreground">{order.phone}</p>
                {order.email && <p className="text-xs text-muted-foreground">{order.email}</p>}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{order.total || 0} ₴</p>
                <p className="text-xs text-muted-foreground">
                  {order.createdAt ? new Date(order.createdAt.seconds * 1000 || order.createdAt).toLocaleDateString("uk-UA") : ""}
                </p>
              </div>
            </div>
            {order.items && order.items.length > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Позиції:</p>
                {order.items.map((item: any, i: number) => (
                  <p key={i} className="text-xs text-muted-foreground">• {item.name} — {item.price} ₴</p>
                ))}
              </div>
            )}
            {order.message && (
              <p className="text-xs text-muted-foreground mt-1 border-t pt-1">💬 {order.message}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ========== Main Admin Page ==========
export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-muted/30"><div className="w-12 h-12 rounded-full bg-muted animate-pulse" /></div>
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-3">Доступ обмежено</h1>
        <p className="text-muted-foreground mb-6">Увійдіть в акаунт для доступу до адмін-панелі</p>
        <Button asChild><Link href="/">На головну</Link></Button>
      </div>
    </div>
  )
  if (user.email !== ADMIN_EMAIL) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-3">Немає доступу</h1>
        <p className="text-muted-foreground mb-6">Ця сторінка доступна тільки адміністратору</p>
        <Button asChild><Link href="/">На головну</Link></Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            На сайт
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Адмін-панель</h1>
        <Tabs defaultValue="clients">
          <TabsList className="mb-6">
            <TabsTrigger value="clients" className="flex items-center gap-2"><Users className="w-4 h-4" />Клієнти</TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2"><Calculator className="w-4 h-4" />Калькулятор</TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" />Замовлення</TabsTrigger>
          </TabsList>
          <TabsContent value="clients"><UsersTab /></TabsContent>
          <TabsContent value="calculator"><CalculatorTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
