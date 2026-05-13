// src/components/auth/UserMenu.tsx
"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "./AuthModal"
import { User, LogOut, ChevronDown } from "lucide-react"

export function UserMenu() {
  const { user, profile, loading, logout } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
  }

  // Not logged in — show trigger button
  if (!user) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border bg-background shadow-xs h-9 px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
          title="Увійти / Зареєструватися"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Увійти</span>
        </button>
        <AuthModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    )
  }

  // Logged in — show avatar + dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
        className="flex items-center gap-1.5 rounded-lg hover:bg-accent transition-colors px-1.5 py-1"
      >
        {profile?.photoURL ? (
          <img
            src={profile.photoURL}
            alt=""
            className="w-8 h-8 rounded-full border-2 border-primary object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-1.5 bg-popover border rounded-xl shadow-lg p-1.5 z-50 min-w-[200px]">
          <div className="px-3 py-2 border-b mb-1">
            <p className="text-sm font-medium truncate">{profile?.name || "Користувач"}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email || user.email}</p>
          </div>
          <button
            onClick={() => { logout(); setMenuOpen(false) }}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </button>
        </div>
      )}
    </div>
  )
}
