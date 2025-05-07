import { getPosts } from '@/modules/dashboard/api/queries/get-posts'
import Link from 'next/link'

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link href="/posts/create" className="px-3 py-1 bg-primary text-white rounded">New Post</Link>
      </div>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="border rounded p-4">
            <Link href={`/posts/${post.id}`} className="font-semibold text-lg hover:underline">
              {post.title}
            </Link>
            <div className="text-xs text-gray-500">{post.createdAt.toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
} 