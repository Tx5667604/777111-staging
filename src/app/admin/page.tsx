// src/app/admin/page.tsx
"use client"

import { useState, useEffect } from "react"
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
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Users,
  Package,
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
} from "lucide-react"

const ADMIN_EMAIL = "fit5667604@gmail.com"

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
          <Input
            placeholder="Пошук клієнта..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} клієнтів</p>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Клієнтів не знайдено</p>
        )}
        {filtered.map((u) => (
          <Card key={u.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">
                  {(u.name || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-1">
                <div>
                  <p className="text-sm font-medium truncate">{u.name || "—"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {u.email || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {u.phone || "—"}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 shrink-0" />
                  {u.createdAt
                    ? new Date(u.createdAt.seconds * 1000 || u.createdAt).toLocaleDateString("uk-UA")
                    : "—"}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 shrink-0" />
                  {u.lastLogin
                    ? new Date(u.lastLogin.seconds * 1000 || u.lastLogin).toLocaleDateString("uk-UA")
                    : "—"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ========== Inventory Tab ==========
interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  price: number
  position: string
  note: string
  createdAt?: any
  updatedAt?: any
}

function InventoryTab() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    position: "",
    note: "",
  })

  useEffect(() => {
    const { db } = initFirebase()
    const q = query(collection(db, "inventory"), orderBy("name", "asc"))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as InventoryItem)))
    })
    return unsub
  }, [])

  const resetForm = () =>
    setForm({ name: "", category: "", quantity: 0, price: 0, position: "", note: "" })

  const handleSave = async () => {
    if (!form.name.trim()) return
    const { db } = initFirebase()
    if (editing) {
      await updateDoc(doc(db, "inventory", editing), {
        ...form,
        updatedAt: Timestamp.now(),
      })
    } else {
      await addDoc(collection(db, "inventory"), {
        ...form,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }
    resetForm()
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (item: InventoryItem) => {
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      position: item.position,
      note: item.note,
    })
    setEditing(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    const { db } = initFirebase()
    await deleteDoc(doc(db, "inventory", id))
  }

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.position.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Пошук товару..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} позицій</p>
        <Button onClick={() => { resetForm(); setEditing(null); setShowForm(true) }} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Додати
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-4 border-primary/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <Input
                placeholder="Назва товару *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Категорія"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <Input
                placeholder="Позиція (стелаж/полиця)"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Кількість"
                value={form.quantity || ""}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="Ціна (грн)"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
              />
              <Input
                placeholder="Примітка"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setShowForm(false); setEditing(null) }}>
                <X className="w-4 h-4 mr-1" />
                Скасувати
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                {editing ? "Зберегти" : "Додати"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 font-medium">Назва</th>
              <th className="pb-2 font-medium">Категорія</th>
              <th className="pb-2 font-medium">К-сть</th>
              <th className="pb-2 font-medium">Ціна</th>
              <th className="pb-2 font-medium">Позиція</th>
              <th className="pb-2 font-medium">Примітка</th>
              <th className="pb-2 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-8">
                  Товарів не знайдено
                </td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="py-2.5 font-medium">{item.name}</td>
                <td className="py-2.5 text-muted-foreground">{item.category || "—"}</td>
                <td className="py-2.5">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : item.quantity < 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.quantity}
                  </span>
                </td>
                <td className="py-2.5">{item.price ? `${item.price} ₴` : "—"}</td>
                <td className="py-2.5 text-muted-foreground">{item.position || "—"}</td>
                <td className="py-2.5 text-muted-foreground max-w-[120px] truncate">
                  {item.note || "—"}
                </td>
                <td className="py-2.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 hover:bg-accent rounded transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ========== Main Admin Page ==========
export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  // Не авторизован
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold mb-3">Доступ обмежено</h1>
          <p className="text-muted-foreground mb-6">Увійдіть в акаунт для доступу до адмін-панелі</p>
          <Button asChild>
            <Link href="/">На головну</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Не админ
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold mb-3">Немає доступу</h1>
          <p className="text-muted-foreground mb-6">
            Ця сторінка доступна тільки адміністратору
          </p>
          <Button asChild>
            <Link href="/">На головну</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
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

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Клієнти
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Товари
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <UsersTab />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
