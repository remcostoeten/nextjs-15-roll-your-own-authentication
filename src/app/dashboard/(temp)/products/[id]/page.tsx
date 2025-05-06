import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id

  return (
    <PageLayout
      heading={`Product ${productId}`}
      description="View and edit product details"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-md bg-muted" />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Basic information about the product</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                      <dd className="mt-1 text-sm">Product {productId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">SKU</dt>
                      <dd className="mt-1 text-sm">PRD-{productId.padStart(4, "0")}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                      <dd className="mt-1 text-sm">Electronics</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Brand</dt>
                      <dd className="mt-1 text-sm">Acme Inc.</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                      <dd className="mt-1 text-sm">
                        This is a sample product description. It provides details about the product's features,
                        benefits, and specifications. A good product description helps customers understand what they're
                        buying and why it's valuable to them.
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                  <CardDescription>Manage product stock and availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">In Stock</dt>
                      <dd className="mt-1 text-sm">24 units</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Low Stock Threshold</dt>
                      <dd className="mt-1 text-sm">10 units</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Warehouse</dt>
                      <dd className="mt-1 text-sm">Main Warehouse</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Last Restocked</dt>
                      <dd className="mt-1 text-sm">June 12, 2023</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pricing" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>Manage product pricing and discounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Base Price</dt>
                      <dd className="mt-1 text-sm">$49.99</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Sale Price</dt>
                      <dd className="mt-1 text-sm">$39.99</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Cost</dt>
                      <dd className="mt-1 text-sm">$25.00</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Profit Margin</dt>
                      <dd className="mt-1 text-sm">37.5%</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  )
}
