import { randomUUID } from "crypto";
import { createUploadthing, UTFiles } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { verifySession } from "@/src/modules/auth/session";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);
    return { message: err.message };
  },
});

/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
      acl: "public-read",
    },
  })
    .middleware(async () => {
      const session = await verifySession();
      if (!session) throw new Error("Unauthorized");

      return { userId: session.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;