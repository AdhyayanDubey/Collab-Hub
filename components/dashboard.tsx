"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentList } from "@/components/document-list"
import { UserNav } from "@/components/user-nav"
import { Search } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleCreateDocument = () => {
    // Generate a random document ID for now
    // In the real implementation, this would come from the backend
    const docId = Math.random().toString(36).substring(2, 15)
    router.push(`/documents/${docId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="font-bold text-xl flex items-center">
            <span className="text-primary mr-2">Collab</span>
            <span>Docs</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleCreateDocument}>Create Document</Button>
          </div>
        </div>
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="shared">Shared with me</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            <DocumentList filter={searchQuery} type="recent" />
          </TabsContent>
          <TabsContent value="shared" className="space-y-4">
            <DocumentList filter={searchQuery} type="shared" />
          </TabsContent>
          <TabsContent value="favorites" className="space-y-4">
            <DocumentList filter={searchQuery} type="favorites" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

