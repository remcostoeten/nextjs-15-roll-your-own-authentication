import { parseColorVariables } from "@/modules/(demos)/colors/helpers/color-parser"
import { Header } from "@/modules/(demos)/colors/components/colors-header"
import { Hero } from "@/modules/(demos)/colors/components/colors-hero"
import { ColorsGrid } from "@/modules/(demos)/colors/components/colors-grid"
import { DemoSection } from "@/modules/(demos)/colors/components/demo-section"

export async function ColorsView() {
    const colors = await parseColorVariables()

    return (
        <div className="min-h-screen text-title-light">
            <Header />
            <main className="container mx-auto px-4 pb-20">
                <Hero />

                {/* Add the new Demo Section */}
                <div className="max-w-7xl mx-auto mb-20">
                    <DemoSection colors={colors} />
                </div>

                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-title-light mb-8 text-center">All Color Variables</h2>
                    <ColorsGrid colors={colors} />
                </div>
            </main>
        </div>
    )
}

