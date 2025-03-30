"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Hash, Volume2, Plus, Settings, ChevronDown, ChevronRight, FileText, Mic, Video, Search } from "lucide-react"

interface WorkspaceSidebarProps {
  workspaceId: string
}

// Mock data for channels
const MOCK_CHANNELS = [
  { id: "general-ws1", name: "general", type: "text", workspaceId: "ws1" },
  { id: "announcements-ws1", name: "announcements", type: "text", workspaceId: "ws1" },
  { id: "resources-ws1", name: "resources", type: "text", workspaceId: "ws1" },
  { id: "design-reviews-ws1", name: "design-reviews", type: "text", workspaceId: "ws1" },
  { id: "voice-chat-ws1", name: "voice-chat", type: "voice", workspaceId: "ws1" },
]

// Mock data for documents
const MOCK_DOCUMENTS = [
  { id: "document-1-ws1", name: "project-proposal", type: "document", workspaceId: "ws1" },
  { id: "document-2-ws1", name: "design-system", type: "document", workspaceId: "ws1" },
  { id: "document-3-ws1", name: "meeting-notes", type: "document", workspaceId: "ws1" },
]

// Mock data for direct messages
const MOCK_DIRECT_MESSAGES = [
  { id: "user1", name: "John Doe", status: "online", workspaceId: "ws1" },
  { id: "user2", name: "Jane Smith", status: "idle", workspaceId: "ws1" },
  { id: "user3", name: "Mike Johnson", status: "offline", workspaceId: "ws1" },
  { id: "user4", name: "Sarah Williams", status: "dnd", workspaceId: "ws1" },
]

export function WorkspaceSidebar({ workspaceId }: WorkspaceSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const [workspace, setWorkspace] = useState<any>(null)
  const [channels, setChannels] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [directMessages, setDirectMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [showChannels, setShowChannels] = useState(true)
  const [showDocuments, setShowDocuments] = useState(true)
  const [showDirectMessages, setShowDirectMessages] = useState(true)

  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelType, setNewChannelType] = useState("text")
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false)
  const [isCreatingChannel, setIsCreatingChannel] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch workspace data
    setTimeout(() => {
      // Mock workspace data
      setWorkspace({
        id: workspaceId,
        name: "Design Team",
        avatar: "/placeholder.svg?height=40&width=40",
        color: "#10b981",
      })

      // Filter channels for this workspace
      setChannels(MOCK_CHANNELS.filter((channel) => channel.workspaceId === workspaceId))

      // Filter documents for this workspace
      setDocuments(MOCK_DOCUMENTS.filter((doc) => doc.workspaceId === workspaceId))

      // Filter direct messages for this workspace
      setDirectMessages(MOCK_DIRECT_MESSAGES.filter((dm) => dm.workspaceId === workspaceId))

      setIsLoading(false)
    }, 500)
  }, [workspaceId])

  const handleCreateChannel = () => {
    setIsCreatingChannel(true)

    // Simulate API call to create channel
    setTimeout(() => {
      const newChannel = {
        id: `${newChannelName.toLowerCase().replace(/\s+/g, "-")}-${workspaceId}`,
        name: newChannelName.toLowerCase().replace(/\s+/g, "-"),
        type: newChannelType,
        workspaceId,
      }

      setChannels([...channels, newChannel])
      setNewChannelName("")
      setNewChannelType("text")
      setIsCreatingChannel(false)
      setIsChannelDialogOpen(false)

      toast({
        title: "Channel created",
        description: `#${newChannel.name} has been created successfully.`,
      })

      // Navigate to the new channel
      router.push(`/workspaces/${workspaceId}/channels/${newChannel.id}`)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="w-64 border-r bg-muted/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="w-64 border-r bg-muted/40 flex flex-col">
      <div className="h-16 border-b flex items-center px-4">
        <Avatar className="h-8 w-8 mr-2" style={{ borderColor: workspace?.color }}>
          <AvatarImage src={workspace?.avatar} alt={workspace?.name} />
          <AvatarFallback style={{ backgroundColor: workspace?.color }}>
            {workspace?.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h2 className="font-semibold text-lg truncate flex-1">{workspace?.name}</h2>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/workspaces/${workspaceId}/settings`}>
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search channels..." className="pl-8 h-9" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Channels Section */}
          <div>
            <div
              className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-muted rounded-md"
              onClick={() => setShowChannels(!showChannels)}
            >
              <div className="flex items-center text-sm font-medium">
                {showChannels ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                TEXT CHANNELS
              </div>
              <Dialog open={isChannelDialogOpen} onOpenChange={setIsChannelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Channel</DialogTitle>
                    <DialogDescription>Add a new channel to your workspace.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="channel-name">Channel name</Label>
                      <Input
                        id="channel-name"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="e.g. general"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="channel-type">Channel type</Label>
                      <select
                        id="channel-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newChannelType}
                        onChange={(e) => setNewChannelType(e.target.value)}
                      >
                        <option value="text">Text Channel</option>
                        <option value="voice">Voice Channel</option>
                        <option value="document">Document</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsChannelDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateChannel} disabled={!newChannelName || isCreatingChannel}>
                      {isCreatingChannel ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {showChannels && (
              <div className="mt-1 space-y-[2px]">
                {channels
                  .filter((channel) => channel.type === "text")
                  .map((channel) => (
                    <Link
                      key={channel.id}
                      href={`/workspaces/${workspaceId}/channels/${channel.id}`}
                      className={cn(
                        "flex items-center px-2 py-1.5 text-sm rounded-md",
                        pathname === `/workspaces/${workspaceId}/channels/${channel.id}`
                          ? "bg-muted font-medium"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{channel.name}</span>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          {/* Voice Channels Section */}
          <div>
            <div
              className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-muted rounded-md"
              onClick={() => setShowChannels(!showChannels)}
            >
              <div className="flex items-center text-sm font-medium">
                {showChannels ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                VOICE CHANNELS
              </div>
            </div>

            {showChannels && (
              <div className="mt-1 space-y-[2px]">
                {channels
                  .filter((channel) => channel.type === "voice")
                  .map((channel) => (
                    <Link
                      key={channel.id}
                      href={`/workspaces/${workspaceId}/channels/${channel.id}`}
                      className={cn(
                        "flex items-center px-2 py-1.5 text-sm rounded-md",
                        pathname === `/workspaces/${workspaceId}/channels/${channel.id}`
                          ? "bg-muted font-medium"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{channel.name}</span>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div>
            <div
              className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-muted rounded-md"
              onClick={() => setShowDocuments(!showDocuments)}
            >
              <div className="flex items-center text-sm font-medium">
                {showDocuments ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                DOCUMENTS
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showDocuments && (
              <div className="mt-1 space-y-[2px]">
                {documents.map((document) => (
                  <Link
                    key={document.id}
                    href={`/workspaces/${workspaceId}/channels/${document.id}`}
                    className={cn(
                      "flex items-center px-2 py-1.5 text-sm rounded-md",
                      pathname === `/workspaces/${workspaceId}/channels/${document.id}`
                        ? "bg-muted font-medium"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{document.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Direct Messages Section */}
          <div>
            <div
              className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-muted rounded-md"
              onClick={() => setShowDirectMessages(!showDirectMessages)}
            >
              <div className="flex items-center text-sm font-medium">
                {showDirectMessages ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                DIRECT MESSAGES
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showDirectMessages && (
              <div className="mt-1 space-y-[2px]">
                {directMessages.map((user) => (
                  <Link
                    key={user.id}
                    href={`/workspaces/${workspaceId}/direct/${user.id}`}
                    className={cn(
                      "flex items-center px-2 py-1.5 text-sm rounded-md",
                      pathname === `/workspaces/${workspaceId}/direct/${user.id}`
                        ? "bg-muted font-medium"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <div className="relative mr-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-2 w-2 rounded-full ring-1 ring-background",
                          user.status === "online" && "bg-green-500",
                          user.status === "idle" && "bg-yellow-500",
                          user.status === "dnd" && "bg-red-500",
                          user.status === "offline" && "bg-gray-500",
                        )}
                      ></span>
                    </div>
                    <span className="truncate">{user.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Mic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

