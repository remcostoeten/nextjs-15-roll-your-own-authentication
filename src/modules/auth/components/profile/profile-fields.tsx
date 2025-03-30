"use client";

import { Input, Label } from "ui";
import { Mail, MapPin, Globe, Twitter, Github } from "lucide-react";
import type { TUser } from "@/src/server/db/schema/types";

const PROFILE_FIELDS = [
  { key: "name", icon: null, placeholder: "John Doe" },
  { key: "email", icon: Mail, placeholder: "john@example.com" },
  { key: "location", icon: MapPin, placeholder: "San Francisco, CA" },
  { key: "website", icon: Globe, placeholder: "https://example.com" },
  { key: "twitter", icon: Twitter, placeholder: "@username" },
  { key: "github", icon: Github, placeholder: "username" },
] as const;

type ProfileFieldsProps = {
  user: Omit<TUser, "password">;
  isPending: boolean;
};

export function ProfileFields({ user, isPending }: ProfileFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROFILE_FIELDS.map(({ key, icon: Icon, placeholder }) => (
          <div className="grid gap-2" key={key}>
            <Label htmlFor={key} className="text-sm font-medium">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <div className="relative">
              {Icon && (
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <Input
                id={key}
                name={key}
                className={Icon ? "pl-10" : ""}
                placeholder={placeholder}
                defaultValue={String(user[key as keyof typeof user] || "")}
                disabled={isPending}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
        <Input 
          id="bio" 
          name="bio" 
          placeholder="Tell us about yourself"
          defaultValue={user.bio || ""} 
          disabled={isPending}
        />
      </div>
    </>
  );
} 