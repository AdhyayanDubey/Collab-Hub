"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Hash, FileText, Users, MessageSquare, Plus, ArrowRight } from "lucide-react"

interface WorkspaceHomeProps {
  workspace: any
}

// Mock data for recent activity
const MOCK_ACTIVITY = [
  {
    id: "act1",
    type: "message",
    user: { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
    channel: { id: "general-ws1", name: "general" },
    content: "Just uploaded the new design files for review",
    timestamp: "2 hours ago",
  },
  {
    id: "act2",
    type: "document",
    user: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    document: { id: "document-1-ws1", name: "project-proposal" },
    content: "Updated the project timeline section",
    timestamp: "3 hours ago",
  },
  {
    id: "act3",
    type: "channel",
    user: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    channel: { id: "design-reviews-ws1", name: "design-reviews" },
    content: "Created a new channel",
    timestamp: "1 day ago",
  },
  {
    id: "act4",
    type: "message",
    user: { id: "user4", name: "Sarah Williams", avatar: "/placeholder.svg?height=40&width=40" },
    channel: { id: "announcements-ws1", name: "announcements" },
    content: "Team meeting scheduled for tomorrow at 10 AM",
    timestamp: "1 day ago",
  },
  {
    id: "act5",
    type: "document",
    user: { id: "user3", name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    document: { id: "document-2-ws1", name: "design-system" },
    content: "Added new component documentation",
    timestamp: "2 days ago",
  },
]

// Mock data for channels
const MOCK_CHANNELS = [
  {
    id: "general-ws1",
    name: "general",
    type: "text",
    members: 8,
    description: "General discussions for the Design Team",
  },
  {
    id: "announcements-ws1",
    name: "announcements",
    type: "text",
    members: 8,
    description: "Important announcements for the team",
  },
  { id: "resources-ws1", name: "resources", type: "text", members: 7, description: "Design resources and assets" },
  {
    id: "design-reviews-ws1",
    name: "design-reviews",
    type: "text",
    members: 6,
    description: "Channel for design review discussions",
  },
  {
    id: "voice-chat-ws1",
    name: "voice-chat",
    type: "voice",
    members: 4,
    description: "Voice channel for the Design Team",
  },
]

// Mock data for documents
const MOCK_DOCUMENTS = [
  { id: "document-1-ws1", name: "project-proposal", type: "document", lastEdited: "2 hours ago", editors: 3 },
  { id: "document-2-ws1", name: "design-system", type: "document", lastEdited: "1 day ago", editors: 2 },
  { id: "document-3-ws1", name: "meeting-notes", type: "document", lastEdited: "3 days ago", editors: 1 },
]

export function WorkspaceHome({ workspace }: WorkspaceHomeProps) {
  const router = useRouter()

  return (
    <div className="flex-1 overflow-auto">
      <ScrollArea className="h-full">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Home</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Members</CardTitle>
                <CardDescription>{workspace.members} members in this workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Avatar key={i} className="border-2 border-background inline-block h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                  {workspace.members > 5 && (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium border-2 border-background">
                      +{workspace.members - 5}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/workspaces/${workspace.id}/settings?tab=members`)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Channels</CardTitle>
                <CardDescription>{MOCK_CHANNELS.length} channels in this workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {MOCK_CHANNELS.slice(0, 3).map((channel) => (
                    <div key={channel.id} className="flex items-center text-sm">
                      <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{channel.name}</span>
                    </div>
                  ))}
                  {MOCK_CHANNELS.length > 3 && (
                    <div className="text-sm text-muted-foreground">+{MOCK_CHANNELS.length - 3} more channels</div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/workspaces/${workspace.id}/settings?tab=channels`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Channel
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Documents</CardTitle>
                <CardDescription>{MOCK_DOCUMENTS.length} collaborative documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {MOCK_DOCUMENTS.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doc.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {MOCK_ACTIVITY.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{activity.user.name}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                        </div>
                        <p className="mt-1">{activity.content}</p>
                        <div className="mt-2 flex items-center">
                          {activity.type === "message" && (
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Hash className="h-3 w-3 mr-1" />
                              <span>#{activity.channel.name}</span>
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                          {activity.type === "document" && (
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <FileText className="h-3 w-3 mr-1" />
                              <span>{activity.document.name}</span>
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                          {activity.type === "channel" && (
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Hash className="h-3 w-3 mr-1" />
                              <span>#{activity.channel.name}</span>
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Tabs defaultValue="channels">
              <TabsList className="mb-4">
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="channels" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOCK_CHANNELS.map((channel) => (
                    <Card
                      key={channel.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/workspaces/${workspace.id}/channels/${channel.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          {channel.type === "text" ? (
                            <Hash className="h-5 w-5 mr-2 text-muted-foreground" />
                          ) : (
                            <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
                          )}
                          <CardTitle className="text-lg">{channel.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-1">{channel.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">{channel.members} members</div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed flex flex-col items-center justify-center p-6">
                    <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="font-medium">Create Channel</p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Add a new channel to your workspace
                    </p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOCK_DOCUMENTS.map((doc) => (
                    <Card
                      key={doc.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/workspaces/${workspace.id}/channels/${doc.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <CardTitle className="text-lg">{doc.name}</CardTitle>
                        </div>
                        <CardDescription>Last edited {doc.lastEdited}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          {doc.editors} {doc.editors === 1 ? "person" : "people"} editing
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed flex flex-col items-center justify-center p-6">
                    <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="font-medium">Create Document</p>
                    <p className="text-sm text-muted-foreground text-center mt-1">Start a new collaborative document</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

