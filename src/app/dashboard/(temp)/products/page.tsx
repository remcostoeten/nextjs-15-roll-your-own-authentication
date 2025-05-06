import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function ProductsPage() {
  return (
    <PageLayout
      heading="Products"
      description="Manage your product catalog"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle>Product {i + 1}</CardTitle>
              <CardDescription>Product description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md bg-muted" />
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium">${(19.99 + i * 10).toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">In stock: {10 + i * 5}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  )
}
