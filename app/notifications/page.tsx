"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, MessageSquare, AtSign, Hash, Settings, Check, X, Trash2, BellOff } from "lucide-react"

// Mock data for notifications
const MOCK_NOTIFICATIONS = [
  {
    id: "notif1",
    type: "friend_request",
    user: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "notif2",
    type: "mention",
    user: { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
    channel: { id: "general-ws1", name: "general", workspaceId: "ws1", workspaceName: "Design Team" },
    message: "Hey @CurrentUser, what do you think about the new design?",
    timestamp: "10 minutes ago",
    read: false,
  },
  {
    id: "notif3",
    type: "direct_message",
    user: { id: "user3", name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    message: "Are you available for a quick call?",
    timestamp: "30 minutes ago",
    read: true,
  },
  {
    id: "notif4",
    type: "workspace_invite",
    user: { id: "user4", name: "Sarah Williams", avatar: "/placeholder.svg?height=40&width=40" },
    workspace: { id: "ws2", name: "Marketing Team" },
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "notif5",
    type: "mention",
    user: { id: "user5", name: "Alex Brown", avatar: "/placeholder.svg?height=40&width=40" },
    channel: { id: "announcements-ws1", name: "announcements", workspaceId: "ws1", workspaceName: "Design Team" },
    message: "Team meeting @everyone tomorrow at 10 AM",
    timestamp: "2 hours ago",
    read: true,
  },
  {
    id: "notif6",
    type: "reaction",
    user: { id: "user6", name: "Emily Davis", avatar: "/placeholder.svg?height=40&width=40" },
    reaction: "👍",
    message: "Great work on the presentation!",
    timestamp: "3 hours ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [isLoading, setIsLoading] = useState(false)

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const handleMarkAllAsRead = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
      setIsLoading(false)

      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read.",
      })
    }, 500)
  }

  const handleClearAll = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setNotifications([])
      setIsLoading(false)

      toast({
        title: "Notifications cleared",
        description: "All notifications have been cleared.",
      })
    }, 500)
  }

  const handleAcceptFriendRequest = (notifId: string) => {
    // Find the notification
    const notification = notifications.find((n) => n.id === notifId)

    if (notification) {
      // Mark as read and update UI
      setNotifications(notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n)))

      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${notification.user.name}.`,
      })
    }
  }

  const handleRejectFriendRequest = (notifId: string) => {
    // Find the notification
    const notification = notifications.find((n) => n.id === notifId)

    if (notification) {
      // Mark as read and update UI
      setNotifications(notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n)))

      toast({
        title: "Friend request rejected",
        description: "The friend request has been rejected.",
      })
    }
  }

  const handleAcceptWorkspaceInvite = (notifId: string) => {
    // Find the notification
    const notification = notifications.find((n) => n.id === notifId)

    if (notification) {
      // Mark as read and update UI
      setNotifications(notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n)))

      toast({
        title: "Workspace invite accepted",
        description: `You have joined ${notification.workspace.name}.`,
      })
    }
  }

  const handleDismissNotification = (notifId: string) => {
    // Remove the notification
    setNotifications(notifications.filter((n) => n.id !== notifId))

    toast({
      title: "Notification dismissed",
      description: "The notification has been removed.",
    })
  }

  const renderNotificationContent = (notification: any) => {
    switch (notification.type) {
      case "friend_request":
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <span className="font-medium">Friend Request</span>
            </div>
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span> sent you a friend request.
            </p>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" onClick={() => handleAcceptFriendRequest(notification.id)}>
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleRejectFriendRequest(notification.id)}>
                <X className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          </div>
        )

      case "mention":
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <AtSign className="h-4 w-4 text-primary" />
              <span className="font-medium">Mention</span>
              <Badge variant="outline" className="ml-auto">
                <Hash className="h-3 w-3 mr-1" />
                {notification.channel.name}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span> mentioned you in{" "}
              {notification.channel.workspaceName}.
            </p>
            <div className="bg-muted p-2 rounded-md text-sm">{notification.message}</div>
          </div>
        )

      case "direct_message":
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-medium">Direct Message</span>
            </div>
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span> sent you a message.
            </p>
            <div className="bg-muted p-2 rounded-md text-sm">{notification.message}</div>
          </div>
        )

      case "workspace_invite":
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <span className="font-medium">Workspace Invite</span>
            </div>
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span> invited you to join{" "}
              <span className="font-medium">{notification.workspace.name}</span>.
            </p>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" onClick={() => handleAcceptWorkspaceInvite(notification.id)}>
                <Check className="h-4 w-4 mr-2" />
                Join
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDismissNotification(notification.id)}>
                <X className="h-4 w-4 mr-2" />
                Ignore
              </Button>
            </div>
          </div>
        )

      case "reaction":
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{notification.reaction}</span>
              <span className="font-medium">Reaction</span>
            </div>
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span> reacted to your message.
            </p>
            <div className="bg-muted p-2 rounded-md text-sm">{notification.message}</div>
          </div>
        )

      default:
        return <p>Unknown notification type</p>
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
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isLoading || unreadCount === 0}
              >
                Mark all as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={isLoading || notifications.length === 0}
              >
                Clear all
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">
                  All
                  {unreadCount > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
                <TabsTrigger value="direct">Direct Messages</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={notification.read ? "opacity-80" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                            <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            {renderNotificationContent(notification)}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDismissNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <BellOff className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">You're all caught up!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mentions" className="space-y-4">
              {notifications.filter((n) => n.type === "mention").length > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter((n) => n.type === "mention")
                    .map((notification) => (
                      <Card key={notification.id} className={notification.read ? "opacity-80" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                              <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {renderNotificationContent(notification)}
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDismissNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <AtSign className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No mentions</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't been mentioned recently</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="direct" className="space-y-4">
              {notifications.filter((n) => n.type === "direct_message").length > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter((n) => n.type === "direct_message")
                    .map((notification) => (
                      <Card key={notification.id} className={notification.read ? "opacity-80" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                              <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {renderNotificationContent(notification)}
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDismissNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No direct messages</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">You don't have any new direct messages</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

