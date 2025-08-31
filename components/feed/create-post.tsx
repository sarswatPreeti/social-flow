"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import type { MediaType, Post } from "@/types/social";
import { useFlowAuth } from "@/hooks/use-flow-auth";
import { useFlowTransaction } from "@/hooks/use-flow-transaction";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CreatePost() {
  const { address, isLoggedIn } = useFlowAuth();
  const { executeTransaction, isLoading, status } = useFlowTransaction();
  const [text, setText] = useState("");
  const [medias, setMedias] = useState<{ type: MediaType; url: string }[]>([]);
  useSWR("/api/posts", fetcher);

  function handleAddMedia(
    e: React.ChangeEvent<HTMLInputElement>,
    type: MediaType
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMedias((m) => [...m, { type, url }]);
    e.currentTarget.value = "";
  }

  async function submitToFlow() {
    if (!isLoggedIn || !text.trim()) return;

    try {
      await executeTransaction(
        `
          transaction(content: String) {
            prepare(signer: &Account) {
              log("Creating post by: ".concat(signer.address.toString()))
              log("Post content: ".concat(content))
            }
            
            execute {
              log("Post created successfully on Flow blockchain")
            }
          }
        `,
        (arg: any, t: any) => [arg(text, t.String)],
        {
          onSuccess: (txId) => {
            console.log("Post transaction submitted:", txId);
          },
          onError: (error) => {
            console.error("Post creation failed:", error);
            alert(`Failed to create post: ${error}`);
          },
          onStatusUpdate: (txStatus) => {
            if (txStatus.status === 4) {
              // Transaction sealed - clear form and refresh posts
              setText("");
              setMedias([]);
              mutate("/api/posts");
              console.log("Post successfully created on blockchain!");
            }
          },
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  async function submit() {
    if (!address) {
      alert("Please connect your wallet first!");
      return;
    }

    // Submit to Flow blockchain first
    await submitToFlow();

    // Also submit to local API for immediate UI update
    const body = {
      author: {
        address,
        name: "You",
        avatarUrl: "/generic-avatar.png",
      },
      text,
      media: medias,
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const { post } = (await res.json()) as { post: Post };
      return post;
    } catch (error) {
      console.error("Error submitting to API:", error);
    }
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-neutral-900 px-4 py-4">
      <div className="flex items-center gap-3">
        <Image
          src="/generic-avatar.png"
          alt="Your avatar"
          width={44}
          height={44}
          className="rounded-full"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isLoggedIn ? "What's on your mind?" : "Connect wallet to post..."
          }
          className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-[17px]"
          disabled={!isLoggedIn}
        />
      </div>

      {medias.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {medias.map((m, idx) => (
            <div key={idx} className="overflow-hidden rounded-[20px]">
              {m.type === "video" ? (
                <video
                  src={m.url}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <Image
                  src={m.url || "/placeholder.svg"}
                  alt="Selected media"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isLoading && status && (
        <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border border-blue-300 border-t-blue-600"></div>
          <span>Transaction Status: {status.statusString}</span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <label
          className={`text-white/80 hover:text-white cursor-pointer rounded-full bg-white/10 h-10 px-3 grid place-items-center ${
            !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleAddMedia(e, "image")}
            disabled={!isLoggedIn}
          />
          Image
        </label>
        <label
          className={`text-white/80 hover:text-white cursor-pointer rounded-full bg-white/10 h-10 px-3 grid place-items-center ${
            !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="file"
            accept="image/gif"
            hidden
            onChange={(e) => handleAddMedia(e, "gif")}
            disabled={!isLoggedIn}
          />
          GIF
        </label>
        <label
          className={`text-white/80 hover:text-white cursor-pointer rounded-full bg-white/10 h-10 px-3 grid place-items-center ${
            !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => handleAddMedia(e, "video")}
            disabled={!isLoggedIn}
          />
          Video
        </label>

        <Button
          disabled={!isLoggedIn || !text.trim() || isLoading}
          onClick={submit}
          className="ml-auto rounded-full bg-[#1E6CFF] text-white hover:bg-[#1557d6] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
