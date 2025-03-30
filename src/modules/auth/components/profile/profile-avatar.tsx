import { Avatar, AvatarFallback, AvatarImage, Badge } from "ui";
import { DEFAULT_AVATAR_URL } from "@/src/core/config/constants";
import { TUser } from "@/src/server/db/schema";

type TProfileAvatarProps = {
  user: TUser;
  updatedName?: string;
  updatedEmail?: string;
};

export function ProfileAvatar({ user, updatedName, updatedEmail }: TProfileAvatarProps) {
  return (
    <div className="flex items-center gap-x-6">
      <Avatar className="w-16 h-16 rounded-full object-cover">
        <AvatarImage src={user?.avatarUrl || DEFAULT_AVATAR_URL()} alt={user.name} />
        <AvatarFallback>{user.name ? user.name.slice(0, 2).toUpperCase() : "??"}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-medium">{updatedName || user.name}</h3>
        <p className="text-sm text-gray-500">{updatedEmail || user.email}</p>
        <Badge variant="secondary" className="mt-1">{user.role || "user"}</Badge>
      </div>
    </div>
  );
} 