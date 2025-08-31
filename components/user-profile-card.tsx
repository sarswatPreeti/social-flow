import type { Post } from "@/types/social";
import Image from "next/image";

interface UserProfileCardProps {
  address: string;
  name?: string;
  avatarUrl?: string;
}

export function UserProfileCard({
  address,
  name,
  avatarUrl,
}: UserProfileCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-white/10 px-4 py-3">
      <Image
        src={avatarUrl || "/generic-avatar.png"}
        alt="avatar"
        width={44}
        height={44}
        className="rounded-full"
      />
      <div>
        <div className="font-semibold text-white">{name || "User"}</div>
        <div className="text-xs text-white/60">{address}</div>
      </div>
    </div>
  );
}
