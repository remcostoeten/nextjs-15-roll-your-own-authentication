import { useEffect, useState } from "react";
import { getSession } from "../session/get";
import type { TSession } from "@/src/server/db/schema";

export function useSession() {
  const [session, setSession] = useState<TSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const result = await getSession();
        setSession(result || null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { session, isLoading };
} 