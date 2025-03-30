"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreVertical, Star, Users, Clock } from "lucide-react"

// Mock data - this would come from the backend in a real implementation
const MOCK_DOCUMENTS = {
  recent: [
    {
      id: "doc1",
      title: "Project Proposal",
      updatedAt: "2023-11-10T14:30:00Z",
      collaborators: [
        { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      isFavorite: true,
    },
    {
      id: "doc2",
      title: "Meeting Notes",
      updatedAt: "2023-11-09T10:15:00Z",
      collaborators: [{ id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" }],
      isFavorite: false,
    },
    {
      id: "doc3",
      title: "Product Roadmap",
      updatedAt: "2023-11-08T16:45:00Z",
      collaborators: [
        { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "user3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "user4", name: "Sarah Williams", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      isFavorite: true,
    },
  ],
  shared: [
    {
      id: "doc4",
      title: "Marketing Strategy",
      updatedAt: "2023-11-07T09:20:00Z",
      collaborators: [
        { id: "user5", name: "Alex Brown", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      isFavorite: false,
      sharedBy: "Alex Brown",
    },
    {
      id: "doc5",
      title: "Budget Planning",
      updatedAt: "2023-11-06T13:10:00Z",
      collaborators: [
        { id: "user6", name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      isFavorite: true,
      sharedBy: "Emily Davis",
    },
  ],
  favorites: [],
}

// Initialize favorites from recent and shared lists
MOCK_DOCUMENTS.favorites = [
  ...MOCK_DOCUMENTS.recent.filter((doc) => doc.isFavorite),
  ...MOCK_DOCUMENTS.shared.filter((doc) => doc.isFavorite),
]

interface DocumentListProps {
  filter: string
  type: "recent" | "shared" | "favorites"
}

export function DocumentList({ filter, type }: DocumentListProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS[type])

  // Filter documents based on search query
  useEffect(() => {
    if (filter) {
      const filtered = MOCK_DOCUMENTS[type].filter((doc) => doc.title.toLowerCase().includes(filter.toLowerCase()))
      setDocuments(filtered)
    } else {
      setDocuments(MOCK_DOCUMENTS[type])
    }
  }, [filter, type])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleOpenDocument = (docId: string) => {
    router.push(`/documents/${docId}`)
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No documents found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {filter ? "Try a different search term" : "Create a new document to get started"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle
                className="text-lg cursor-pointer hover:text-primary"
                onClick={() => handleOpenDocument(doc.id)}
              >
                {doc.title}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenDocument(doc.id)}>Open</DropdownMenuItem>
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>{doc.isFavorite ? "Remove from favorites" : "Add to favorites"}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              <span>Last edited {formatDate(doc.updatedAt)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {type === "shared" && doc.sharedBy && (
              <Badge variant="outline" className="mb-2">
                Shared by {doc.sharedBy}
              </Badge>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex -space-x-2">
              {doc.collaborators.slice(0, 3).map((user, i) => (
                <Avatar key={user.id} className="border-2 border-background h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {doc.collaborators.length > 3 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                  +{doc.collaborators.length - 3}
                </div>
              )}
            </div>
            <div className="flex items-center">
              {doc.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-2" />}
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground ml-1">{doc.collaborators.length}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

