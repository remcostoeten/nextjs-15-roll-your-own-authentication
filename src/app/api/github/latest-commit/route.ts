import { NextResponse } from "next/server"
import { fetchLatestCommit } from "@/modules/github/api/queries/fetch-latest-commit"

export async function GET() {
    const { commit, error } = await fetchLatestCommit()

    if (error) {
        return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ commit })
}

