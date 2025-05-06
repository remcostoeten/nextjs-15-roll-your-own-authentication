import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

export default function OrdersPage() {
  return (
    <PageLayout heading="Orders" description="View and manage customer orders">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-8 w-[300px]" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-5 p-3 bg-muted/50 text-sm font-medium">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Date</div>
              <div>Status</div>
              <div>Total</div>
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 p-3 border-t items-center">
                <div className="font-mono text-sm">#ORD-{1000 + i}</div>
                <div>Customer {i + 1}</div>
                <div className="text-muted-foreground text-sm">{new Date(2023, 5, 15 - i).toLocaleDateString()}</div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      i % 3 === 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                        : i % 3 === 1
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                    }`}
                  >
                    {i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Processing" : "Shipped"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>${(49.99 + i * 10).toFixed(2)}</span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
