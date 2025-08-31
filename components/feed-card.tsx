"use client"

import { Ellipsis, Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  avatar: string
  name: string
  time: string
  following?: boolean
  question: string
  leftImage?: string
  rightImage?: string
  likes: number
  comments: number
}

export function FeedCard({ avatar, name, time, following, question, leftImage, rightImage, likes, comments }: Props) {
  const [liked, setLiked] = useState(false)

  return (
    <article className="bg-white text-neutral-900 rounded-3xl p-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={avatar || "/placeholder.svg"}
            alt={`${name} avatar`}
            width={44}
            height={44}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-semibold leading-tight">{name}</p>
            <p className="text-xs text-neutral-500 leading-tight">{time}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={cn(
              "px-3 h-8 rounded-full text-sm border transition",
              following
                ? "bg-white border-neutral-200 text-neutral-900"
                : "bg-neutral-100 border-neutral-200 text-neutral-900",
            )}
            aria-pressed={!!following}
          >
            {following ? "Following" : "Follow"}
          </button>
          <button
            aria-label="More"
            className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500"
          >
            <Ellipsis className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question */}
      <h2 className="mt-3 text-lg font-semibold leading-snug">{question}</h2>

      {/* Media (optional) */}
      {(leftImage || rightImage) && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {leftImage && (
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={leftImage || "/placeholder.svg"}
                alt="option A"
                width={600}
                height={400}
                className="h-40 w-full object-cover"
              />
            </div>
          )}
          {rightImage && (
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={rightImage || "/placeholder.svg"}
                alt="option B"
                width={600}
                height={400}
                className="h-40 w-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => setLiked((v) => !v)}
          className={cn(
            "h-10 rounded-full px-3 flex items-center gap-2 border transition",
            liked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-neutral-200 text-neutral-700",
          )}
          aria-pressed={liked}
        >
          <Heart className={cn("h-5 w-5", liked ? "fill-white" : "")} />
          <span className="text-sm">{liked ? likes + 1 : likes}</span>
        </button>

        <button className="h-10 rounded-full px-3 flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{comments}</span>
        </button>

        <div className="ml-auto">
          <button
            aria-label="More"
            className="h-10 w-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500"
          >
            <Ellipsis className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  )
}
