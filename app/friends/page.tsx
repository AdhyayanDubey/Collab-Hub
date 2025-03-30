"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import {
  Search,
  UserPlus,
  Check,
  X,
  MessageSquare,
  Phone,
  Video,
  MoreHorizontal,
  UserX,
  UserCheck,
  Users,
} from "lucide-react"

// Mock data for friends
const MOCK_FRIENDS = [
  {
    id: "user1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    customStatus: "Working on designs",
  },
  {
    id: "user2",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "idle",
    customStatus: "In a meeting",
  },
  {
    id: "user3",
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "dnd",
    customStatus: "Coding",
  },
  {
    id: "user4",
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    customStatus: "",
  },
  {
    id: "user5",
    name: "Alex Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    customStatus: "Gaming",
  },
]

// Mock data for pending friend requests
const MOCK_PENDING = [
  { id: "user6", name: "Emily Davis", avatar: "/placeholder.svg?height=40&width=40", type: "incoming" },
  { id: "user7", name: "David Wilson", avatar: "/placeholder.svg?height=40&width=40", type: "outgoing" },
  { id: "user8", name: "Lisa Martinez", avatar: "/placeholder.svg?height=40&width=40", type: "incoming" },
]

// Mock data for blocked users
const MOCK_BLOCKED = [
  { id: "user9", name: "Robert Taylor", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user10", name: "Jennifer Garcia", avatar: "/placeholder.svg?height=40&width=40" },
]

// Mock data for suggested friends
const MOCK_SUGGESTED = [
  { id: "user11", name: "Thomas Anderson", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 4 },
  { id: "user12", name: "Olivia Moore", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 3 },
  { id: "user13", name: "William Clark", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 2 },
  { id: "user14", name: "Sophia Lee", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 5 },
]

export default function FriendsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState(MOCK_FRIENDS)
  const [pending, setPending] = useState(MOCK_PENDING)
  const [blocked, setBlocked] = useState(MOCK_BLOCKED)
  const [suggested, setSuggested] = useState(MOCK_SUGGESTED)
  const [addFriendInput, setAddFriendInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault()

    if (!addFriendInput.trim()) return

    setIsLoading(true)

    // Simulate API call to add friend
    setTimeout(() => {
      setIsLoading(false)
      setAddFriendInput("")

      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${addFriendInput}.`,
      })
    }, 1000)
  }

  const handleAcceptRequest = (userId: string) => {
    // Find the user in pending requests
    const user = pending.find((p) => p.id === userId)

    if (user) {
      // Remove from pending
      setPending(pending.filter((p) => p.id !== userId))

      // Add to friends
      setFriends([
        ...friends,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          status: "online",
          customStatus: "",
        },
      ])

      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${user.name}.`,
      })
    }
  }

  const handleRejectRequest = (userId: string) => {
    // Remove from pending
    setPending(pending.filter((p) => p.id !== userId))

    toast({
      title: "Friend request rejected",
      description: "The friend request has been rejected.",
    })
  }

  const handleRemoveFriend = (userId: string) => {
    // Remove from friends
    setFriends(friends.filter((f) => f.id !== userId))

    toast({
      title: "Friend removed",
      description: "This user has been removed from your friends list.",
    })
  }

  const handleBlockUser = (userId: string) => {
    // Find the user in friends
    const user = friends.find((f) => f.id === userId)

    if (user) {
      // Remove from friends
      setFriends(friends.filter((f) => f.id !== userId))

      // Add to blocked
      setBlocked([
        ...blocked,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      ])

      toast({
        title: "User blocked",
        description: `${user.name} has been blocked.`,
      })
    }
  }

  const handleUnblockUser = (userId: string) => {
    // Remove from blocked
    setBlocked(blocked.filter((b) => b.id !== userId))

    toast({
      title: "User unblocked",
      description: "This user has been unblocked.",
    })
  }

  const handleAddSuggested = (userId: string) => {
    // Find the user in suggested
    const user = suggested.find((s) => s.id === userId)

    if (user) {
      // Remove from suggested
      setSuggested(suggested.filter((s) => s.id !== userId))

      // Add to pending (outgoing)
      setPending([
        ...pending,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          type: "outgoing",
        },
      ])

      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${user.name}.`,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
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
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search friends..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="online">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="online">Online</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="blocked">Blocked</TabsTrigger>
                <TabsTrigger value="add">Add Friend</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="online" className="space-y-4">
              {filteredFriends.filter((friend) => friend.status !== "offline").length > 0 ? (
                <div className="grid gap-4">
                  {filteredFriends
                    .filter((friend) => friend.status !== "offline")
                    .map((friend) => (
                      <Card key={friend.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={friend.avatar} alt={friend.name} />
                                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span
                                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-1 ring-background ${getStatusColor(friend.status)}`}
                                ></span>
                              </div>
                              <div>
                                <div className="font-medium">{friend.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {friend.status === "online"
                                    ? "Online"
                                    : friend.status === "idle"
                                      ? "Idle"
                                      : friend.status === "dnd"
                                        ? "Do Not Disturb"
                                        : "Offline"}
                                  {friend.customStatus && ` • ${friend.customStatus}`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/direct-messages/${friend.id}`)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Video className="h-4 w-4" />
                              </Button>
                              <div className="relative">
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-popover z-10 hidden group-hover:block">
                                  <div className="py-1">
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                                      onClick={() => handleRemoveFriend(friend.id)}
                                    >
                                      Remove Friend
                                    </button>
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                                      onClick={() => handleBlockUser(friend.id)}
                                    >
                                      Block
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <UserPlus className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No online friends</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {searchQuery ? "No friends match your search" : "None of your friends are online right now"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {filteredFriends.length > 0 ? (
                <div className="grid gap-4">
                  {filteredFriends.map((friend) => (
                    <Card key={friend.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={friend.avatar} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-1 ring-background ${getStatusColor(friend.status)}`}
                              ></span>
                            </div>
                            <div>
                              <div className="font-medium">{friend.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {friend.status === "online"
                                  ? "Online"
                                  : friend.status === "idle"
                                    ? "Idle"
                                    : friend.status === "dnd"
                                      ? "Do Not Disturb"
                                      : "Offline"}
                                {friend.customStatus && ` • ${friend.customStatus}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/direct-messages/${friend.id}`)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Video className="h-4 w-4" />
                            </Button>
                            <div className="relative group">
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-popover z-10 hidden group-hover:block">
                                <div className="py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                                    onClick={() => handleRemoveFriend(friend.id)}
                                  >
                                    Remove Friend
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                                    onClick={() => handleBlockUser(friend.id)}
                                  >
                                    Block
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <UserPlus className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No friends found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {searchQuery ? "No friends match your search" : "Add some friends to get started"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pending.length > 0 ? (
                <div className="space-y-6">
                  {pending.some((p) => p.type === "incoming") && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Incoming Friend Requests</h3>
                      <div className="grid gap-4">
                        {pending
                          .filter((p) => p.type === "incoming")
                          .map((request) => (
                            <Card key={request.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={request.avatar} alt={request.name} />
                                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{request.name}</div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleAcceptRequest(request.id)}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Accept
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleRejectRequest(request.id)}>
                                      <X className="h-4 w-4 mr-2" />
                                      Decline
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                  {pending.some((p) => p.type === "outgoing") && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Outgoing Friend Requests</h3>
                      <div className="grid gap-4">
                        {pending
                          .filter((p) => p.type === "outgoing")
                          .map((request) => (
                            <Card key={request.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={request.avatar} alt={request.name} />
                                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{request.name}</div>
                                      <div className="text-xs text-muted-foreground">Request sent</div>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => handleRejectRequest(request.id)}>
                                    Cancel
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <UserCheck className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No pending requests</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">You don't have any pending friend requests</p>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Suggested Friends</h3>
                {suggested.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {suggested.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {user.mutualFriends} mutual friend{user.mutualFriends !== 1 ? "s" : ""}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleAddSuggested(user.id)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">No suggested friends at the moment</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="blocked" className="space-y-4">
              {blocked.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You won't see messages from blocked users. They can't add you as a friend either.
                  </p>
                  <div className="grid gap-4">
                    {blocked.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.name}</div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleUnblockUser(user.id)}>
                              Unblock
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <UserX className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No blocked users</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't blocked any users</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Add Friend</h3>
                  <p className="text-sm text-muted-foreground">
                    You can add friends with their username or email address.
                  </p>
                  <form onSubmit={handleAddFriend} className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter a username or email"
                        value={addFriendInput}
                        onChange={(e) => setAddFriendInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!addFriendInput.trim() || isLoading}>
                        {isLoading ? "Sending..." : "Send Request"}
                      </Button>
                    </div>
                  </form>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Other Ways to Connect</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Invite Friends</h4>
                            <p className="text-sm text-muted-foreground">Share an invite link with your friends</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Find Communities</h4>
                            <p className="text-sm text-muted-foreground">Join workspaces with similar interests</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

