"use client";

import Image from "next/image";
import PostActions from "./post-actions";
import type { Post } from "@/types/social";
import { shortAddr, useFlowAuth } from "@/hooks/use-flow-auth";
import { useState } from "react";

type Props = {
  post: Post;
  onVoteSuccess?: () => void;
};

export default function PostCard({ post, onVoteSuccess }: Props) {
  const { address } = useFlowAuth();
  const [localVotes, setLocalVotes] = useState({
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  });

  const handleVoteSuccess = (voteType: "up" | "down") => {
    // Update local vote counts when vote is successful
    setLocalVotes((prev) => ({
      ...prev,
      [voteType === "up" ? "upvotes" : "downvotes"]:
        prev[voteType === "up" ? "upvotes" : "downvotes"] + 1,
    }));

    // Call parent callback if provided
    if (onVoteSuccess) {
      onVoteSuccess();
    }
  };

  return (
    <article className="bg-white text-neutral-900 rounded-[28px] shadow-sm px-4 py-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={post.author.avatarUrl || "/generic-avatar.png"}
            alt="Author avatar"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div>
            <div className="text-neutral-900 font-semibold leading-5">
              {post.author.name || "User"}
            </div>
            <div className="text-xs text-neutral-500">
              {new Date(post.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              • @{shortAddr(post.author.address)}
            </div>
          </div>
        </div>

        <button
          className={`px-4 h-9 rounded-full border text-sm ${
            post.following
              ? "bg-neutral-100 text-neutral-900 border-neutral-200"
              : "bg-white text-neutral-900 border-neutral-200"
          }`}
        >
          {post.following ? "Following" : "Follow"}
        </button>
      </header>

      {post.text && (
        <p className="mt-3 text-lg font-semibold text-neutral-900 leading-snug">
          {post.text}
        </p>
      )}

      {post.media && post.media.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {post.media.map((m, idx) => (
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
                  alt="Post media"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <PostActions
          postId={parseInt(post.id) || 0}
          upvotes={localVotes.upvotes}
          downvotes={localVotes.downvotes}
          comments={post.comments}
          onVoteSuccess={handleVoteSuccess}
        />
      </div>
    </article>
  );
}
