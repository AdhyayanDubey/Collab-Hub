"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Plus, Users, Folder, Settings, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for workspaces
const MOCK_WORKSPACES = [
  {
    id: "ws1",
    name: "Design Team",
    description: "Collaborative workspace for the design team",
    members: 8,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#10b981",
    recentActivity: "2 hours ago",
  },
  {
    id: "ws2",
    name: "Marketing",
    description: "Marketing team workspace",
    members: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#3b82f6",
    recentActivity: "1 day ago",
  },
  {
    id: "ws3",
    name: "Product Development",
    description: "Product roadmap and development discussions",
    members: 15,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#8b5cf6",
    recentActivity: "3 hours ago",
  },
  {
    id: "ws4",
    name: "Customer Support",
    description: "Support team collaboration",
    members: 6,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#f59e0b",
    recentActivity: "Just now",
  },
]

export default function WorkspacesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES)
  const [searchQuery, setSearchQuery] = useState("")
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredWorkspaces = workspaces.filter(
    (workspace) =>
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateWorkspace = () => {
    setIsCreating(true)

    // Simulate API call to create workspace
    setTimeout(() => {
      const newWorkspace = {
        id: `ws${workspaces.length + 1}`,
        name: newWorkspaceName,
        description: newWorkspaceDescription,
        members: 1,
        avatar: "/placeholder.svg?height=40&width=40",
        color: getRandomColor(),
        recentActivity: "Just now",
      }

      setWorkspaces([...workspaces, newWorkspace])
      setNewWorkspaceName("")
      setNewWorkspaceDescription("")
      setIsCreating(false)
      setIsDialogOpen(false)

      toast({
        title: "Workspace created",
        description: `${newWorkspaceName} has been created successfully.`,
      })
    }, 1000)
  }

  const getRandomColor = () => {
    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workspaces..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Workspaces</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new workspace</DialogTitle>
                <DialogDescription>Create a new workspace to collaborate with your team.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Workspace name</Label>
                  <Input
                    id="name"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="e.g. Design Team"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newWorkspaceDescription}
                    onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                    placeholder="What's this workspace for?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName || isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleWorkspaceClick(workspace.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2" style={{ borderColor: workspace.color }}>
                    <AvatarImage src={workspace.avatar} alt={workspace.name} />
                    <AvatarFallback style={{ backgroundColor: workspace.color }}>
                      {workspace.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{workspace.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{workspace.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{workspace.members} members</span>
                  <span className="mx-2">•</span>
                  <span>Active {workspace.recentActivity}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <div className="flex justify-between w-full text-sm">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Folder className="mr-1 h-4 w-4" />
                    <span>12 Channels</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Settings className="mr-1 h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {filteredWorkspaces.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Folder className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No workspaces found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {searchQuery ? "Try a different search term" : "Create your first workspace to get started"}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Workspace
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new workspace</DialogTitle>
                    <DialogDescription>Create a new workspace to collaborate with your team.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Workspace name</Label>
                      <Input
                        id="name"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        placeholder="e.g. Design Team"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newWorkspaceDescription}
                        onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                        placeholder="What's this workspace for?"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName || isCreating}>
                      {isCreating ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

