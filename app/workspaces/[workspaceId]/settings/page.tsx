"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { WorkspaceHeader } from "@/components/workspace-header"

interface WorkspaceSettingsPageProps {
  params: {
    workspaceId: string
  }
}

// Mock data for workspace
const MOCK_WORKSPACE_DATA = {
  ws1: {
    id: "ws1",
    name: "Design Team",
    description: "Collaborative workspace for the design team",
    members: 8,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#10b981",
    recentActivity: "2 hours ago",
  },
  ws2: {
    id: "ws2",
    name: "Marketing",
    description: "Marketing team workspace",
    members: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#3b82f6",
    recentActivity: "1 day ago",
  },
}

export default function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [workspace, setWorkspace] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [mentionsOnly, setMentionsOnly] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch workspace data
    setTimeout(() => {
      const workspaceData = MOCK_WORKSPACE_DATA[params.workspaceId as keyof typeof MOCK_WORKSPACE_DATA]
      setWorkspace(workspaceData)
      setName(workspaceData?.name || "")
      setDescription(workspaceData?.description || "")
      setIsLoading(false)
    }, 500)
  }, [params.workspaceId])

  const handleSaveGeneral = () => {
    setIsSaving(true)

    // Simulate API call to update workspace
    setTimeout(() => {
      setWorkspace({
        ...workspace,
        name,
        description,
      })
      setIsSaving(false)

      toast({
        title: "Settings saved",
        description: "Your workspace settings have been updated.",
      })
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)

    // Simulate API call to update notification settings
    setTimeout(() => {
      setIsSaving(false)

      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated.",
      })
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Workspace not found</h2>
          <p className="text-muted-foreground mt-2">
            The workspace you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <WorkspaceHeader workspace={workspace} />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Workspace Settings</h1>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your workspace details and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-avatar">Workspace Avatar</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={workspace.avatar} alt={workspace.name} />
                        <AvatarFallback style={{ backgroundColor: workspace.color }}>
                          {workspace.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Change Avatar</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Workspace Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveGeneral} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Workspace</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete this workspace and all of its data.
                      </p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                  <CardDescription>Manage members and their permissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="relative w-64">
                      <Input placeholder="Search members..." />
                    </div>
                    <Button>Invite Members</Button>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">User Name {i}</p>
                            <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            {i === 1 ? "Owner" : "Member"}
                          </Button>
                          {i !== 1 && (
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channels</CardTitle>
                  <CardDescription>Manage channels in this workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="relative w-64">
                      <Input placeholder="Search channels..." />
                    </div>
                    <Button>Create Channel</Button>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {["general", "announcements", "resources", "design-reviews", "voice-chat"].map((channel, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">#{channel}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {channel !== "general" && (
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications from this workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications from this workspace</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mentions">Only Notify on Mentions</Label>
                      <p className="text-sm text-muted-foreground">Only receive notifications when you are mentioned</p>
                    </div>
                    <Switch
                      id="mentions"
                      checked={mentionsOnly}
                      onCheckedChange={setMentionsOnly}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotifications} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

