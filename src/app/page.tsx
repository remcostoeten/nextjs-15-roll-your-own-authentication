import { Header } from "../modules/(homepage)/header/header"
import { Hero } from "../modules/(homepage)/components/hero"
import { Footer } from "../modules/(homepage)/components/footer"
import { SecurityShowcase } from "../modules/(homepage)/components/security-showcase"
import MatrixGrid from "../modules/(homepage)/matrixgrid/components/matrix-grid"
import { fetchLatestCommit } from "../modules/github/api/queries/fetch-latest-commit"

// Update the Home component to handle errors more gracefully
export default async function Home() {
  try {
    // Fetch the latest commit server-side with better error handling
    const { commit, error } = await fetchLatestCommit()

    // Even if there's an error, we'll still have the fallback commit data
    // so we can proceed with rendering the page
    return (
      <div className="min-h-screen bg-[#0D0C0C]">
        <Header />
        <main className="relative">
          <Hero initialCommit={commit} />
          <MatrixGrid />
          <SecurityShowcase />
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error rendering home page:", error)
    // Return a simple fallback UI in case of error
    return (
      <div className="min-h-screen bg-[#0D0C0C] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Roll Your Own Auth</h1>
          <p className="text-[#8C877D] mb-8">Build secure authentication without dependencies.</p>
          <a href="/docs" className="px-4 py-2 bg-white text-black rounded-md">
            View Documentation
          </a>
        </div>
      </div>
    )
  }
}

