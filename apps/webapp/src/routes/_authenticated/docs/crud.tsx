import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, PlusCircle, Pencil, Trash } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@acme/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Textarea } from "@acme/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zCreatePost } from "@acme/db/schema";

import { useTRPC } from "~/utils/trpc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const Route = createFileRoute("/_authenticated/docs/crud")({
  component: CRUDDocsPage,
});

function CRUDDocsPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">CRUD Operations Documentation</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        This interactive documentation shows how CRUD (Create, Read, Update, Delete) operations
        are implemented in the T3 Turbo stack using tRPC, React Query, and Drizzle ORM.
      </p>

      <Tabs defaultValue="demo">
        <TabsList className="mb-4">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="update">Update</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <LiveDemo />
        </TabsContent>

        <TabsContent value="create">
          <CreateDocs />
        </TabsContent>

        <TabsContent value="read">
          <ReadDocs />
        </TabsContent>

        <TabsContent value="update">
          <UpdateDocs />
        </TabsContent>

        <TabsContent value="delete">
          <DeleteDocs />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LiveDemo() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Read - Fetch all posts
  const { data: posts = [], isLoading } = useQuery({
    ...trpc.posts.list.queryOptions(),
  });

  // Create - Add a new post
  const createMutation = useMutation({
    ...trpc.posts.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["posts", "list"]] });
      setIsCreateOpen(false);
    },
  });

  // Update - Edit an existing post
  const updateMutation = useMutation({
    ...trpc.posts.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["posts", "list"]] });
      setIsEditOpen(false);
      setSelectedPost(null);
    },
  });

  // Delete - Remove a post
  const deleteMutation = useMutation({
    ...trpc.posts.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["posts", "list"]] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Management</CardTitle>
        <CardDescription>
          Create, view, edit, and delete posts in real-time
        </CardDescription>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <CreatePostForm
              onSubmit={(data) => createMutation.mutate(data)}
              isPending={createMutation.isPending}
              error={createMutation.error}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">Loading posts...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No posts found. Create one to get started!
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Edit Dialog */}
        {selectedPost && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Post</DialogTitle>
              </DialogHeader>
              <EditPostForm
                post={selectedPost}
                onSubmit={(data) =>
                  updateMutation.mutate({ id: selectedPost.id, ...data })
                }
                isPending={updateMutation.isPending}
                error={updateMutation.error}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface CodeSnippetProps {
  code: string;
  language?: string;
  highlightWords?: string[];
}

interface LineStyle {
  display: string;
  backgroundColor?: string;
}

interface CreatePostFormProps {
  onSubmit: (data: any) => void;
  isPending: boolean;
  error: unknown;
}

interface EditPostFormProps {
  post: Post;
  onSubmit: (data: any) => void;
  isPending: boolean;
  error: unknown;
}

// Documentation components with code snippets
function CodeSnippet({ code, language = "tsx", highlightWords = [] }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customStyle = {
    borderRadius: '0.375rem',
    margin: 0,
    padding: '1rem',
  };

  return (
    <div className="relative">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={customStyle}
        wrapLongLines={true}
        showLineNumbers={true}
        wrapLines={true}
        lineProps={(lineNumber: number) => {
          const style: LineStyle = { display: 'block' };
          if (highlightWords.length > 0) {
            const lineText = code.split('\n')[lineNumber - 1] || '';
            if (highlightWords.some(word => lineText.includes(word))) {
              style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }
          }
          return { style };
        }}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={copyCode}
        className="absolute right-2 top-2 rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function CreateDocs() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Create Operation</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">1. Backend Schema</h3>
        <p>Define your schema using Drizzle and Zod:</p>
        <CodeSnippet
          language="typescript"
          code={`// packages/db/src/schema.ts
export const Post = sqliteTable("post", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  ...updatedAndCreatedAt,
});

export const zCreatePost = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});`}
          highlightWords={["Post", "zCreatePost", "title", "content"]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">2. tRPC Mutation</h3>
        <p>Implement the create endpoint in your tRPC router:</p>
        <CodeSnippet
          language="typescript"
          code={`// packages/api/src/router/post.ts
create: publicProcedure
  .input(zCreatePost)
  .mutation(async ({ input }) => {
    const newPosts = await db
      .insert(Post)
      .values(input)
      .returning();

    if (!newPosts[0]) {
      throw new Error("Failed to create post");
    }

    return newPosts[0];
  }),`}
          highlightWords={["create", "publicProcedure", "mutation"]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">3. Frontend Implementation</h3>
        <p>Use React Query to call the tRPC mutation:</p>
        <CodeSnippet
          language="typescript"
          code={`// Component
const { mutate, error, isPending } = useMutation({
  ...trpc.posts.create.mutationOptions(),
  onSuccess: async () => {
    // Invalidate queries to refresh data
    void queryClient.invalidateQueries({ 
      queryKey: [["posts", "list"]] 
    });
    // Reset form, close dialog, etc.
  },
});

// Form submission handler
const onSubmit = (data) => {
  mutate(data);
};`}
          highlightWords={["useMutation", "mutate", "onSuccess", "invalidateQueries"]}
        />
      </div>
    </div>
  );
}

function ReadDocs() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Read Operations</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">1. tRPC Query Endpoints</h3>
        <p>Implement read endpoints in your tRPC router:</p>
        <CodeSnippet
          language="typescript"
          code={`// packages/api/src/router/post.ts
// Get all posts
list: publicProcedure.query(async () => {
  return db.query.Post.findMany({
    orderBy: (post) => post.createdAt,
    columns: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}),

// Get post by ID
byId: publicProcedure.input(String).query(async (req) => {
  const post = await db.query.Post.findFirst({
    where: eq(Post.id, req.input),
    columns: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return post ?? null;
}),`}
          highlightWords={["list", "byId", "findMany", "findFirst"]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">2. Frontend Query Implementation</h3>
        <p>Use React Query to fetch data:</p>
        <CodeSnippet
          language="typescript"
          code={`// Fetch all posts
const { data: posts = [], isLoading } = useQuery({
  ...trpc.posts.list.queryOptions(),
});

// Fetch single post by ID
const { data: post, isLoading } = useQuery({
  ...trpc.posts.byId.queryOptions(postId),
  // Only run query when postId is available
  enabled: !!postId,
});`}
          highlightWords={["useQuery", "queryOptions", "enabled"]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">3. Displaying Data</h3>
        <p>Render the fetched data in your components:</p>
        <CodeSnippet code={`// Rendering a list of posts
{isLoading ? (
  <div>Loading posts...</div>
) : (
  <ul>
    {posts.map((post) => (
      <li key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </li>
    ))}
  </ul>
)}

// Rendering a single post
{isLoading ? (
  <div>Loading post...</div>
) : post ? (
  <article>
    <h1>{post.title}</h1>
    <p>{post.content}</p>
    <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
  </article>
) : (
  <div>Post not found</div>
)}`} />
      </div>
    </div>
  );
}

function UpdateDocs() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Update Operation</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">1. tRPC Update Endpoint</h3>
        <p>Implement the update mutation in your tRPC router:</p>
        <CodeSnippet
          language="typescript"
          code={`// packages/api/src/router/post.ts
update: publicProcedure
  .input(z.object({
    id: z.string(),
    title: z.string().max(256),
    content: z.string(),
  }))
  .mutation(async ({ input }) => {
    const { id, ...data } = input;
    
    const updatedPosts = await db
      .update(Post)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(Post.id, id))
      .returning();

    if (!updatedPosts[0]) {
      throw new Error("Failed to update post");
    }

    return updatedPosts[0];
  }),`}
          highlightWords={["update", "mutation", "input", "returning"]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">2. Frontend Implementation</h3>
        <p>Use React Query to call the tRPC mutation:</p>
        <CodeSnippet
          language="typescript"
          code={`// Component
const [selectedPost, setSelectedPost] = useState(null);

// Update mutation
const updateMutation = useMutation({
  ...trpc.posts.update.mutationOptions(),
  onSuccess: () => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ 
      queryKey: [["posts", "list"]] 
    });
    // Reset selected post, close dialog, etc.
    setSelectedPost(null);
  },
});

// Form submission handler
const handleUpdate = (data) => {
  updateMutation.mutate({
    id: selectedPost.id,
    ...data
  });
};`}
          highlightWords={["useMutation", "updateMutation", "onSuccess", "invalidateQueries"]}
        />
      </div>
    </div>
  );
}

function DeleteDocs() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Delete Operation</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">1. tRPC Delete Endpoint</h3>
        <p>Implement the delete mutation in your tRPC router:</p>
        <CodeSnippet
          language="typescript"
          code={`// packages/api/src/router/post.ts
delete: publicProcedure
  .input(z.string())
  .mutation(async ({ input: id }) => {
    const deletedPosts = await db
      .delete(Post)
      .where(eq(Post.id, id))
      .returning();

    if (!deletedPosts[0]) {
      throw new Error("Failed to delete post");
    }

    return deletedPosts[0];
  }),`}
          highlightWords={["delete", "mutation", "returning"]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">2. Frontend Implementation</h3>
        <p>Use React Query to call the tRPC mutation:</p>
        <CodeSnippet
          language="typescript"
          code={`// Delete mutation
const deleteMutation = useMutation({
  ...trpc.posts.delete.mutationOptions(),
  onSuccess: () => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ 
      queryKey: [["posts", "list"]] 
    });
  },
});

// Delete handler with confirmation
const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this post?")) {
    deleteMutation.mutate(id);
  }
};

// Delete button in UI
<Button
  variant="destructive"
  size="sm"
  onClick={() => handleDelete(post.id)}
>
  <Trash className="h-4 w-4" />
  Delete
</Button>`}
          highlightWords={["deleteMutation", "handleDelete", "mutate", "invalidateQueries"]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">3. Optimistic Updates</h3>
        <p>Improve user experience with optimistic updates:</p>
        <CodeSnippet
          language="typescript"
          code={`// Delete with optimistic updates
const deleteMutation = useMutation({
  ...trpc.posts.delete.mutationOptions(),
  onMutate: async (id) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ 
      queryKey: [["posts", "list"]]
    });
    
    // Snapshot the previous value
    const previousPosts = queryClient.getQueryData([
      ["posts", "list"]
    ]);
    
    // Optimistically update to the new value
    queryClient.setQueryData(
      [["posts", "list"]], 
      (old) => old.filter(post => post.id !== id)
    );
    
    // Return a context object with the snapshotted value
    return { previousPosts };
  },
  onError: (err, id, context) => {
    // If the mutation fails, use the context to roll back
    queryClient.setQueryData(
      [["posts", "list"]], 
      context.previousPosts
    );
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ 
      queryKey: [["posts", "list"]]
    });
  },
});`}
          highlightWords={["onMutate", "onError", "onSettled", "cancelQueries", "setQueryData", "invalidateQueries"]}
        />
      </div>
    </div>
  );
}

function CreatePostForm({ onSubmit, isPending, error }: CreatePostFormProps) {
  const form = useForm({
    resolver: zodResolver(zCreatePost),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const errorMessage = error instanceof Error ? error.message : "Failed to create post";
  const hasError = error !== null && error !== undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {hasError && (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <span className="block sm:inline">
              {errorMessage}
            </span>
          </div>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Publish Post"}
        </Button>
      </form>
    </Form>
  );
}

function EditPostForm({ post, onSubmit, isPending, error }: EditPostFormProps) {
  const form = useForm({
    resolver: zodResolver(zCreatePost),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  const errorMessage = error instanceof Error ? error.message : "Failed to update post";
  const hasError = error !== null && error !== undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {hasError && (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <span className="block sm:inline">
              {errorMessage}
            </span>
          </div>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Updating..." : "Update Post"}
        </Button>
      </form>
    </Form>
  );
} 