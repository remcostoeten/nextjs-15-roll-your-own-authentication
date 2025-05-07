import { getPost } from '@/modules/dashboard/api/queries/get-post'

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPost(Number(params.id))
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto">{JSON.stringify(post.content, null, 2)}</pre>
      <div className="text-xs text-gray-500 mt-4">Created: {post.createdAt.toLocaleString()}</div>
    </div>
  )
} 