"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smile, PlusCircle, Gift, Reply, Bookmark, MoreHorizontal, Edit, Trash } from "lucide-react"

interface DirectMessageContentProps {
  user: any
}

// Mock data for direct messages
const MOCK_DIRECT_MESSAGES = {
  user1: [
    {
      id: "dm1",
      sender: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      content: "Hey there! How's it going?",
      timestamp: "Today at 10:30 AM",
      reactions: [],
    },
    {
      id: "dm2",
      sender: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
      content: "Hi John! I'm doing well, thanks for asking. How about you?",
      timestamp: "Today at 10:32 AM",
      reactions: [],
    },
    {
      id: "dm3",
      sender: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      content: "I'm good! Just wanted to check if you had a chance to look at the design mockups I sent yesterday?",
      timestamp: "Today at 10:35 AM",
      reactions: [],
    },
    {
      id: "dm4",
      sender: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
      content: "Yes, I did! They look great. I especially like the new color scheme you proposed.",
      timestamp: "Today at 10:40 AM",
      reactions: [{ emoji: "👍", count: 1, users: ["user1"] }],
    },
    {
      id: "dm5",
      sender: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      content: "Thanks! I'm glad you like it. I'll share the final version with the team later today.",
      timestamp: "Today at 10:45 AM",
      reactions: [],
    },
  ],
  user2: [
    {
      id: "dm1",
      sender: { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      content: "Hi there! Do you have a minute to discuss the project timeline?",
      timestamp: "Yesterday at 3:15 PM",
      reactions: [],
    },
    {
      id: "dm2",
      sender: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
      content: "Sure, I'm available now. What's on your mind?",
      timestamp: "Yesterday at 3:20 PM",
      reactions: [],
    },
    {
      id: "dm3",
      sender: { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      content: "I'm concerned about the deadline for the first milestone. I think we might need an extra week.",
      timestamp: "Yesterday at 3:25 PM",
      reactions: [],
    },
  ],
}

export function DirectMessageContent({ user }: DirectMessageContentProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate API call to fetch messages
    setTimeout(() => {
      setMessages(MOCK_DIRECT_MESSAGES[user.id as keyof typeof MOCK_DIRECT_MESSAGES] || [])
      setIsLoading(false)
    }, 500)
  }, [user.id])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    // Add new message to the list
    const newMessage = {
      id: `dm${messages.length + 1}`,
      sender: { id: "current", name: "Current User", avatar: "/placeholder.svg?height=40&width=40" },
      receiver: { id: user.id, name: user.name, avatar: user.avatar },
      content: message,
      timestamp: "Just now",
      reactions: [],
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r: any) => r.emoji === emoji)

          if (existingReaction) {
            // Toggle reaction if user already reacted
            if (existingReaction.users.includes("current")) {
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r: any) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count - 1, users: r.users.filter((u: string) => u !== "current") }
                      : r,
                  )
                  .filter((r: any) => r.count > 0),
              }
            } else {
              // Add user to existing reaction
              return {
                ...msg,
                reactions: msg.reactions.map((r: any) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, "current"] } : r,
                ),
              }
            }
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: ["current"] }],
            }
          }
        }
        return msg
      }),
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              {user.title && <p className="text-muted-foreground">{user.title}</p>}
              <p className="text-muted-foreground mt-2">
                This is the beginning of your direct message history with {user.name}.
              </p>
              <Button className="mt-4">Start a conversation</Button>
            </div>
          ) : (
            messages.map((msg, index) => {
              // Check if this message is from the same user as the previous one and within a short time
              const prevMsg = index > 0 ? messages[index - 1] : null
              const isGrouped = prevMsg && prevMsg.sender.id === msg.sender.id && !msg.attachments

              const isCurrentUser = msg.sender.id === "current"

              return (
                <div
                  key={msg.id}
                  className={`group ${isGrouped ? "mt-0 pt-0" : "mt-2 pt-2"} ${isCurrentUser ? "flex flex-row-reverse" : "flex"}`}
                >
                  {!isGrouped && (
                    <Avatar className={`h-10 w-10 ${isCurrentUser ? "ml-3" : "mr-3"} mt-0.5`}>
                      <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                      <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex-1 ${isGrouped ? (isCurrentUser ? "pr-13" : "pl-13") : ""}`}>
                    {!isGrouped && (
                      <div className={`flex items-center ${isCurrentUser ? "justify-end" : ""}`}>
                        <span className="font-semibold">{msg.sender.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{msg.timestamp}</span>
                      </div>
                    )}
                    <div className={`${isGrouped ? (isCurrentUser ? "mr-13" : "ml-13") : ""}`}>
                      <div
                        className={`${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"} px-3 py-2 rounded-lg inline-block max-w-md`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      {msg.attachments &&
                        msg.attachments.map((attachment: any, i: number) => (
                          <div key={i} className={`mt-2 max-w-md ${isCurrentUser ? "ml-auto" : ""}`}>
                            {attachment.type === "image" && (
                              <div className="rounded-md overflow-hidden border">
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="w-full h-auto"
                                />
                                <div className="p-2 bg-muted/50 text-sm">{attachment.name}</div>
                              </div>
                            )}
                          </div>
                        ))}

                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? "justify-end" : ""}`}>
                          {msg.reactions.map((reaction: any, i: number) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 rounded-full"
                              onClick={() => addReaction(msg.id, reaction.emoji)}
                            >
                              <span className="mr-1">{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${isCurrentUser ? "mr-2" : "ml-2"}`}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2" align="end">
                        <div className="grid grid-cols-6 gap-2">
                          {["👍", "❤️", "😂", "🔥", "👀", "🎉"].map((emoji) => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                addReaction(msg.id, emoji)
                              }}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Reply className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reply</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40" align="end">
                        <div className="grid gap-1">
                          <Button variant="ghost" size="sm" className="justify-start">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="justify-start text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage}>
          <div className="relative">
            <Textarea
              placeholder={`Message ${user.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-12 resize-none pr-20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <Tabs defaultValue="emoji">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="emoji">😀</TabsTrigger>
                      <TabsTrigger value="reactions">👍</TabsTrigger>
                      <TabsTrigger value="stickers">🏷️</TabsTrigger>
                      <TabsTrigger value="gifs">GIF</TabsTrigger>
                    </TabsList>
                    <TabsContent value="emoji" className="mt-2">
                      <div className="grid grid-cols-8 gap-2">
                        {[
                          "😀",
                          "😃",
                          "😄",
                          "😁",
                          "😆",
                          "😅",
                          "😂",
                          "🤣",
                          "😊",
                          "😇",
                          "🙂",
                          "🙃",
                          "😉",
                          "😌",
                          "😍",
                          "🥰",
                          "😘",
                          "😗",
                          "😙",
                          "😚",
                          "😋",
                          "😛",
                          "😝",
                          "😜",
                        ].map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setMessage(message + emoji)
                              setEmojiPickerOpen(false)
                            }}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="reactions" className="mt-2">
                      <div className="grid grid-cols-8 gap-2">
                        {[
                          "👍",
                          "👎",
                          "❤️",
                          "🔥",
                          "🎉",
                          "🙏",
                          "👀",
                          "🚀",
                          "💯",
                          "⭐",
                          "💪",
                          "👏",
                          "🤔",
                          "😂",
                          "😢",
                          "😡",
                        ].map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setMessage(message + emoji)
                              setEmojiPickerOpen(false)
                            }}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add attachment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Gift className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send gift</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

