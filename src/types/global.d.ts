import { ReactNode } from "react";

declare global {
  var db: ReturnType<typeof drizzle>;
}

declare global {
  type PageProps = {
    children: ReactNode
  }
}

export {}
