import { Suspense } from "react"
import { DocumentEditor } from "@/components/document-editor"
import { LoadingEditor } from "@/components/loading-states"

interface DocumentPageProps {
  params: {
    id: string
  }
}

export default function DocumentPage({ params }: DocumentPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<LoadingEditor />}>
        <DocumentEditor documentId={params.id} />
      </Suspense>
    </main>
  )
}

