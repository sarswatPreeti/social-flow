"use client"

import type React from "react"
import { cn } from "@/lib/utils"

export default function IconButton({
  children,
  className,
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  ariaLabel: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "h-9 w-9 rounded-full grid place-items-center",
        "bg-neutral-800 text-white/90 border border-white/10",
        "hover:bg-neutral-700 hover:text-white transition",
        className,
      )}
    >
      {children}
    </button>
  )
}
