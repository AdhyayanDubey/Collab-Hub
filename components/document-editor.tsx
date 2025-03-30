"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserNav } from "@/components/user-nav"
import {
  ArrowLeft,
  Share,
  Users,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  ImageIcon,
} from "lucide-react"

// Mock document data - this would come from the backend in a real implementation
const MOCK_DOCUMENT = {
  id: "doc1",
  title: "Project Proposal",
  content: "This is a collaborative document for our project proposal. We can all edit this together in real-time.",
  collaborators: [
    { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", status: "active" },
    { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32", status: "idle" },
    { id: "user3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", status: "offline" },
  ],
}

// Mock cursor positions for collaborators - in a real implementation, this would be updated via WebSockets
const MOCK_CURSORS = {
  user2: { x: 120, y: 150, color: "#10b981" },
  user3: { x: 250, y: 200, color: "#3b82f6" },
}

interface DocumentEditorProps {
  documentId: string
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const router = useRouter()
  const [document, setDocument] = useState(MOCK_DOCUMENT)
  const [title, setTitle] = useState(MOCK_DOCUMENT.title)
  const [content, setContent] = useState(MOCK_DOCUMENT.content)
  const [isSaving, setIsSaving] = useState(false)
  const [activeUsers, setActiveUsers] = useState<string[]>(["user1", "user2"])
  const editorRef = useRef<HTMLDivElement>(null)

  // Simulate fetching document data
  useEffect(() => {
    // In a real implementation, this would fetch the document from the backend
    console.log(`Fetching document with ID: ${documentId}`)

    // Simulate WebSocket connection for real-time collaboration
    console.log("Establishing WebSocket connection for real-time collaboration")

    return () => {
      // Clean up WebSocket connection when component unmounts
      console.log("Closing WebSocket connection")
    }
  }, [documentId])

  // Simulate saving the document
  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call to save the document
    setTimeout(() => {
      setIsSaving(false)
      console.log("Document saved:", { title, content })
    }, 1000)
  }

  // Render collaborator cursors
  useEffect(() => {
    const renderCursors = () => {
      const editor = editorRef.current
      if (!editor) return

      // Remove existing cursors
      const existingCursors = editor.querySelectorAll(".collaborator-cursor")
      existingCursors.forEach((cursor) => cursor.remove())

      // Add cursors for active collaborators
      Object.entries(MOCK_CURSORS).forEach(([userId, cursor]) => {
        if (activeUsers.includes(userId)) {
          const cursorElement = document.createElement("div")
          cursorElement.className = "collaborator-cursor absolute pointer-events-none"
          cursorElement.style.left = `${cursor.x}px`
          cursorElement.style.top = `${cursor.y}px`
          cursorElement.style.zIndex = "50"

          // Create cursor triangle
          const cursorTriangle = document.createElement("div")
          cursorTriangle.className = "w-3 h-5"
          cursorTriangle.style.borderLeft = `10px solid ${cursor.color}`
          cursorTriangle.style.borderTop = "10px solid transparent"
          cursorTriangle.style.borderBottom = "10px solid transparent"
          cursorElement.appendChild(cursorTriangle)

          // Create name tag
          const nameTag = document.createElement("div")
          const user = document.collaborators.find((u) => u.id === userId)
          nameTag.className = "text-xs text-white px-2 py-1 rounded-sm -ml-1 whitespace-nowrap"
          nameTag.style.backgroundColor = cursor.color
          nameTag.textContent = user?.name || "Unknown User"
          cursorElement.appendChild(nameTag)

          editor.appendChild(cursorElement)
        }
      })
    }

    renderCursors()

    // In a real implementation, cursor positions would be updated via WebSockets
    const cursorUpdateInterval = setInterval(renderCursors, 2000)

    return () => clearInterval(cursorUpdateInterval)
  }, [activeUsers, document.collaborators])

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="ml-4 flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>All changes are saved automatically</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Share Document</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Input placeholder="Add people by email" className="h-8" />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  <span>Copy link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex -space-x-2 ml-2">
              {document.collaborators.slice(0, 3).map((user) => (
                <TooltipProvider key={user.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar
                        className={`h-8 w-8 border-2 border-background ${activeUsers.includes(user.id) ? "ring-2 ring-green-500" : ""}`}
                      >
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {user.name} ({activeUsers.includes(user.id) ? "Online" : "Offline"})
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {document.collaborators.length > 3 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                  +{document.collaborators.length - 3}
                </div>
              )}
            </div>

            <UserNav />
          </div>
        </div>
        <div className="border-t border-b px-4 py-2 flex items-center gap-1 overflow-x-auto">
          <Button variant="ghost" size="icon" onClick={() => formatText("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("underline")}>
            <Underline className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" onClick={() => formatText("insertUnorderedList")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("insertOrderedList")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" onClick={() => formatText("justifyLeft")}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("justifyCenter")}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("justifyRight")}>
            <AlignRight className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" onClick={() => formatText("formatBlock", "<h1>")}>
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("formatBlock", "<h2>")}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => formatText("insertImage")}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 overflow-auto">
        <div
          ref={editorRef}
          className="max-w-3xl mx-auto p-4 min-h-[500px] border rounded-lg relative"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-between">
        <div>
          {activeUsers.length} {activeUsers.length === 1 ? "person" : "people"} editing
        </div>
        <div>Last saved: Just now</div>
      </div>
    </div>
  )
}

