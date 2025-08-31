"use client"

import type React from "react"

import { Bell, Plus, Search } from "lucide-react"
import Link from "next/link"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur border-b border-neutral-800">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo style inspired by wireframe title */}
          <span className="text-blue-600 text-xl font-semibold leading-none">Ask.am</span>
        </Link>
        <div className="flex items-center gap-2">
          <IconButton ariaLabel="Search">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton ariaLabel="Create">
            <Plus className="h-5 w-5" />
          </IconButton>
          <IconButton ariaLabel="Notifications">
            <Bell className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
    </header>
  )
}

function IconButton({
  children,
  ariaLabel,
}: {
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="h-9 w-9 rounded-full bg-neutral-800 text-white/90 flex items-center justify-center border border-neutral-700 hover:bg-neutral-700 transition"
    >
      {children}
    </button>
  )
}
