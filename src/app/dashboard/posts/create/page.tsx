import { PostEditor } from '@/components/ui/post-editor'
import { createPost } from '@/modules/dashboard/api/mutations/create-post'
import { redirect } from 'next/navigation'

export default function CreatePostPage() {
  async function handleSave(data: { title: string; content: any }) {
    'use server'
    await createPost({ ...data, authorId: 1 }) // TODO: replace with real user
    redirect('/posts')
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <PostEditor onSave={handleSave} />
    </div>
  )
} 