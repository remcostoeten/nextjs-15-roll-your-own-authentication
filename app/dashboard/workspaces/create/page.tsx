import { redirect } from "next/navigation";
import { requireAuth } from "@/modules/authentication/utilities/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWorkspace } from "@/modules/workspaces/api/mutations";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Workspace",
  description: "Create a new workspace",
};

export default async function CreateWorkspacePage() {
  await requireAuth();

  async function handleCreateWorkspace(formData: FormData) {
    "use server";

    const result = await createWorkspace(formData);

    if (result.error) {
      return { error: result.error };
    }

    redirect(`/dashboard/workspaces/${result.slug}`);
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md">
        <Card>
          <form action={handleCreateWorkspace}>
            <CardHeader>
              <CardTitle>Create a new workspace</CardTitle>
              <CardDescription>
                Create a workspace to organize your projects and collaborate
                with your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input id="name" name="name" placeholder="Acme Inc." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Team workspace for Acme Inc."
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard/workspaces">Cancel</Link>
              </Button>
              <Button type="submit">Create Workspace</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
