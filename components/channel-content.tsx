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
import { DocumentEditor } from "@/components/document-editor"
import { VoiceChannel } from "@/components/voice-channel"
import { Smile, PlusCircle, Gift, Reply, Bookmark, MoreHorizontal, Edit, Trash } from "lucide-react"

interface ChannelContentProps {
  channel: any
}

// Mock data for messages
const MOCK_MESSAGES = [
  {
    id: "msg1",
    user: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Hey everyone! Welcome to the new channel.",
    timestamp: "Today at 10:30 AM",
    reactions: [
      { emoji: "👍", count: 3, users: ["user2", "user3", "user4"] },
      { emoji: "❤️", count: 2, users: ["user2", "user5"] },
    ],
  },
  {
    id: "msg2",
    user: { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Thanks for setting this up! I think it will be really useful for our design discussions.",
    timestamp: "Today at 10:32 AM",
    reactions: [],
  },
  {
    id: "msg3",
    user: { id: "user3", name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    content: "I've been working on some new design concepts for the homepage. I'll share them here later today.",
    timestamp: "Today at 10:45 AM",
    reactions: [{ emoji: "🔥", count: 4, users: ["user1", "user2", "user4", "user5"] }],
  },
  {
    id: "msg4",
    user: { id: "user4", name: "Sarah Williams", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Looking forward to seeing those designs, Mike!",
    timestamp: "Today at 11:00 AM",
    reactions: [],
  },
  {
    id: "msg5",
    user: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    content:
      "By the way, has anyone seen the latest competitor analysis report? I think there are some interesting insights we could incorporate.",
    timestamp: "Today at 11:15 AM",
    reactions: [{ emoji: "👀", count: 2, users: ["user3", "user5"] }],
  },
  {
    id: "msg6",
    user: { id: "user5", name: "Alex Brown", avatar: "/placeholder.svg?height=40&width=40" },
    content: "I have it. I'll upload it to the resources channel so everyone can access it.",
    timestamp: "Today at 11:20 AM",
    reactions: [{ emoji: "👍", count: 3, users: ["user1", "user2", "user4"] }],
  },
  {
    id: "msg7",
    user: { id: "user2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Thanks Alex! That would be really helpful.",
    timestamp: "Today at 11:22 AM",
    reactions: [],
  },
  {
    id: "msg8",
    user: { id: "user3", name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    content:
      "Here are the design concepts I mentioned earlier. Let me know what you think!\n\nhttps://example.com/designs",
    timestamp: "Today at 2:45 PM",
    reactions: [{ emoji: "🎉", count: 5, users: ["user1", "user2", "user4", "user5", "user6"] }],
    attachments: [{ type: "image", url: "/placeholder.svg?height=300&width=500", name: "homepage-design-v1.png" }],
  },
  {
    id: "msg9",
    user: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    content: "These look great, Mike! I especially like the new navigation layout.",
    timestamp: "Today at 3:00 PM",
    reactions: [],
  },
  {
    id: "msg10",
    user: { id: "user4", name: "Sarah Williams", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Agreed! The color scheme is much more cohesive now.",
    timestamp: "Today at 3:05 PM",
    reactions: [],
  },
]

export function ChannelContent({ channel }: ChannelContentProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate API call to fetch messages
    setTimeout(() => {
      setMessages(MOCK_MESSAGES)
      setIsLoading(false)
    }, 500)
  }, [channel.id])

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
      id: `msg${messages.length + 1}`,
      user: { id: "user1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
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
            if (existingReaction.users.includes("user1")) {
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r: any) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count - 1, users: r.users.filter((u: string) => u !== "user1") }
                      : r,
                  )
                  .filter((r: any) => r.count > 0),
              }
            } else {
              // Add user to existing reaction
              return {
                ...msg,
                reactions: msg.reactions.map((r: any) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, "user1"] } : r,
                ),
              }
            }
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: ["user1"] }],
            }
          }
        }
        return msg
      }),
    )
  }

  if (channel.type === "document") {
    return <DocumentEditor documentId={channel.id} />
  }

  if (channel.type === "voice") {
    return <VoiceChannel channel={channel} />
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
          {messages.map((msg, index) => {
            // Check if this message is from the same user as the previous one and within a short time
            const prevMsg = index > 0 ? messages[index - 1] : null
            const isGrouped = prevMsg && prevMsg.user.id === msg.user.id && !msg.attachments

            return (
              <div key={msg.id} className={`group ${isGrouped ? "mt-0 pt-0" : "mt-2 pt-2"}`}>
                <div className="flex items-start">
                  {!isGrouped && (
                    <Avatar className="h-10 w-10 mr-3 mt-0.5">
                      <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex-1 ${isGrouped ? "pl-13" : ""}`}>
                    {!isGrouped && (
                      <div className="flex items-center">
                        <span className="font-semibold">{msg.user.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{msg.timestamp}</span>
                      </div>
                    )}
                    <div className={`${isGrouped ? "ml-13" : ""}`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.attachments &&
                        msg.attachments.map((attachment: any, i: number) => (
                          <div key={i} className="mt-2 max-w-md">
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
                        <div className="flex flex-wrap gap-1 mt-1">
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

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2">
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
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage}>
          <div className="relative">
            <Textarea
              placeholder={`Message #${channel.name}`}
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

