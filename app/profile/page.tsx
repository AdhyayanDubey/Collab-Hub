"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import {
  Camera,
  Pencil,
  User,
  AtSign,
  Hash,
  Briefcase,
  MapPin,
  Link2,
  Plus,
  Trash2,
  Upload,
  Save,
  MessageSquare,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // User profile data
  const [profile, setProfile] = useState({
    username: "johndoe",
    displayName: "John Doe",
    email: "john.doe@example.com",
    bio: "UI/UX Designer | Front-end Developer | Coffee Enthusiast",
    avatar: "/placeholder.svg?height=128&width=128",
    banner: "/placeholder.svg?height=300&width=1000",
    joinDate: "January 2022",
    location: "San Francisco, CA",
    website: "https://johndoe.design",
    company: "Design Co.",
    status: "online",
    customStatus: "Working on designs",
    badges: ["Early Supporter", "Bug Hunter", "Nitro Subscriber"],
    connections: {
      github: "johndoe",
      twitter: "johndoe_design",
      linkedin: "johndoe",
    },
    privacy: {
      showCurrentActivity: true,
      allowFriendRequests: true,
      showOnlineStatus: true,
    },
  })

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  const handleAddBadge = () => {
    // This would open a dialog to add a badge in a real implementation
    const newBadge = "New Badge"
    setProfile({
      ...profile,
      badges: [...profile.badges, newBadge],
    })

    toast({
      title: "Badge added",
      description: `${newBadge} has been added to your profile.`,
    })
  }

  const handleRemoveBadge = (badge: string) => {
    setProfile({
      ...profile,
      badges: profile.badges.filter((b) => b !== badge),
    })

    toast({
      title: "Badge removed",
      description: `${badge} has been removed from your profile.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-48 md:h-64 w-full bg-muted overflow-hidden">
          <img src={profile.banner || "/placeholder.svg"} alt="Profile banner" className="w-full h-full object-cover" />
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Button variant="secondary" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Change Banner
              </Button>
            </div>
          )}
        </div>

        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Profile info */}
            <div className="md:w-1/3 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative -mt-20 mb-4">
                      <Avatar className="h-32 w-32 border-4 border-background">
                        <AvatarImage src={profile.avatar} alt={profile.displayName} />
                        <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 rounded-full">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                          />
                        </div>
                      ) : (
                        <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                      )}

                      <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                        <AtSign className="h-4 w-4" />
                        {isEditing ? (
                          <Input
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            className="h-7"
                          />
                        ) : (
                          <span>{profile.username}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-center">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            profile.status === "online"
                              ? "bg-green-500"
                              : profile.status === "idle"
                                ? "bg-yellow-500"
                                : profile.status === "dnd"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                          } mr-2`}
                        ></span>
                        <span className="text-sm">
                          {profile.status === "online"
                            ? "Online"
                            : profile.status === "idle"
                              ? "Idle"
                              : profile.status === "dnd"
                                ? "Do Not Disturb"
                                : "Offline"}
                        </span>
                        {profile.customStatus && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="text-sm">{profile.customStatus}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="w-full mt-4 space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          rows={3}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-2">{profile.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {profile.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="px-2 py-1">
                          {badge}
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => handleRemoveBadge(badge)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button variant="outline" size="sm" className="h-7" onClick={handleAddBadge}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Badge
                        </Button>
                      )}
                    </div>

                    <div className="w-full mt-6">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={handleSaveProfile} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member since</p>
                      <p className="font-medium">{profile.joinDate}</p>
                    </div>
                  </div>

                  {profile.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        {isEditing ? (
                          <Input
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="h-8 mt-1"
                          />
                        ) : (
                          <p className="font-medium">{profile.location}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.company && (
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        {isEditing ? (
                          <Input
                            value={profile.company}
                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                            className="h-8 mt-1"
                          />
                        ) : (
                          <p className="font-medium">{profile.company}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-start">
                      <Link2 className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        {isEditing ? (
                          <Input
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            className="h-8 mt-1"
                          />
                        ) : (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline"
                          >
                            {profile.website}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.
118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">GitHub</p>
                        {profile.connections.github ? (
                          <p className="text-sm text-muted-foreground">@{profile.connections.github}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        {profile.connections.github ? "Disconnect" : "Connect"}
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-3 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <div>
                        <p className="font-medium">Twitter</p>
                        {profile.connections.twitter ? (
                          <p className="text-sm text-muted-foreground">@{profile.connections.twitter}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        {profile.connections.twitter ? "Disconnect" : "Connect"}
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-3 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        {profile.connections.linkedin ? (
                          <p className="text-sm text-muted-foreground">@{profile.connections.linkedin}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        {profile.connections.linkedin ? "Disconnect" : "Connect"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Activity and settings */}
            <div className="md:w-2/3 space-y-6">
              <Tabs defaultValue="activity">
                <TabsList className="mb-4">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent activity across workspaces</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Hash className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">Joined #design-reviews channel</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>Design Team</span>
                              <span className="mx-1">•</span>
                              <span>2 hours ago</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">Sent a message in #general</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>Design Team</span>
                              <span className="mx-1">•</span>
                              <span>Yesterday</span>
                            </div>
                            <div className="bg-muted p-2 rounded-md text-sm mt-2">
                              Hey everyone! Just finished the new homepage design. Would love your feedback!
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Upload className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">Uploaded a file in #resources</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>Design Team</span>
                              <span className="mx-1">•</span>
                              <span>2 days ago</span>
                            </div>
                            <div className="bg-muted p-2 rounded-md text-sm mt-2 flex items-center">
                              <svg
                                className="h-8 w-8 mr-2 text-muted-foreground"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                              <div>
                                <p className="font-medium">design-guidelines.pdf</p>
                                <p className="text-xs text-muted-foreground">2.4 MB</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="workspaces" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Workspaces</CardTitle>
                      <CardDescription>Workspaces you're a member of</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary">DT</span>
                              </div>
                              <div>
                                <h4 className="font-medium">Design Team</h4>
                                <p className="text-sm text-muted-foreground">8 members</p>
                              </div>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Badge variant="outline">Owner</Badge>
                              <Button variant="ghost" size="sm" onClick={() => router.push("/workspaces/ws1")}>
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                                <span className="font-semibold text-blue-500">MT</span>
                              </div>
                              <div>
                                <h4 className="font-medium">Marketing Team</h4>
                                <p className="text-sm text-muted-foreground">12 members</p>
                              </div>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Badge variant="outline">Member</Badge>
                              <Button variant="ghost" size="sm" onClick={() => router.push("/workspaces/ws2")}>
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed">
                          <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                            <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                            <h4 className="font-medium">Create Workspace</h4>
                            <p className="text-sm text-muted-foreground">Start a new workspace</p>
                            <Button className="mt-4" variant="outline" onClick={() => router.push("/workspaces")}>
                              Create
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Manage your privacy preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-activity">Show Current Activity</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow others to see what you're currently doing
                          </p>
                        </div>
                        <Switch
                          id="show-activity"
                          checked={profile.privacy.showCurrentActivity}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              privacy: { ...profile.privacy, showCurrentActivity: checked },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="friend-requests">Allow Friend Requests</Label>
                          <p className="text-sm text-muted-foreground">Allow others to send you friend requests</p>
                        </div>
                        <Switch
                          id="friend-requests"
                          checked={profile.privacy.allowFriendRequests}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              privacy: { ...profile.privacy, allowFriendRequests: checked },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="online-status">Show Online Status</Label>
                          <p className="text-sm text-muted-foreground">Show others when you're online</p>
                        </div>
                        <Switch
                          id="online-status"
                          checked={profile.privacy.showOnlineStatus}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              privacy: { ...profile.privacy, showOnlineStatus: checked },
                            })
                          }
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Privacy Settings"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

