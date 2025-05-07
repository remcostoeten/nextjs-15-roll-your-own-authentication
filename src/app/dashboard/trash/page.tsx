import { getTrashedPosts } from '@/modules/dashboard/api/queries/get-posts'
import { restorePost, hardDeletePost } from '@/modules/dashboard/api/mutations/delete-post'
import Button from '@/components/ui/button'

export default async function TrashPage() {
  const posts = await getTrashedPosts()
  async function handleRestore(id: number) {
    'use server'
    await restorePost(id)
  }
  async function handleDelete(id: number) {
    'use server'
    await hardDeletePost(id)
  }
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Trash</h1>
      {posts.length === 0 ? (
        <div className="text-gray-400 text-center py-16">No trashed posts 🎉</div>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="border rounded p-4 flex items-center justify-between bg-white shadow-sm">
              <div>
                <div className="font-semibold text-lg line-through text-gray-400">{post.title}</div>
                <div className="text-xs text-gray-400">Deleted: {post.deletedAt?.toLocaleString?.() || ''}</div>
              </div>
              <div className="flex gap-2">
                <form action={async () => handleRestore(post.id)}>
                  <Button variant="secondary" size="sm">Restore</Button>
                </form>
                <form action={async () => handleDelete(post.id)}>
                  <Button variant="ghost" size="sm" className="text-red-500">Delete Forever</Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 