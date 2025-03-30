import "server-only";
import { db } from "@/server/db";
import { usersSchema } from "@/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { createSession } from "../../session/create";
import { env } from "@/server/env";
import { cookies } from "next/headers";

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL =   `${env.NEXT_PUBLIC_APP_URL}/api/auth/github`;

type GitHubUser = {
  id: string;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  twitter_username: string;
};

export async function getGitHubAuthUrl() {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID as string,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: "read:user user:email",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function handleGitHubCallback(code: string) {
  // Exchange code for access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID as string,
      client_secret: GITHUB_CLIENT_SECRET as string,
      code,
      redirect_uri: GITHUB_CALLBACK_URL,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error("Failed to get access token from GitHub");
  }

  // Get user data from GitHub
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/json",
    },
  });

  const githubUser = (await userResponse.json()) as GitHubUser;

  if (!githubUser.id) {
    throw new Error("Failed to get user data from GitHub");
  }

  // Check if user exists
  let user = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.githubId, githubUser.id),
  });

  if (!user) {
    // Get user's email if not provided in profile
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      });
      const emails = await emailsResponse.json();
      const primaryEmail = emails.find((e: any) => e.primary);
      email = primaryEmail?.email;
    }

    if (!email) {
      throw new Error("No email address available from GitHub");
    }

    const [newUser] = await db.insert(usersSchema).values({
      name: githubUser.name || githubUser.login,
      email: email,
      githubId: githubUser.id,
      authProvider: "github",
      avatarUrl: githubUser.avatar_url,
      bio: githubUser.bio || null,
      location: githubUser.location || null,
      website: githubUser.blog || null,
      twitter: githubUser.twitter_username || null,
      github: githubUser.login,
    }).returning();
    
    user = newUser;
  }

  await createSession(user.id);

  return user;
} 