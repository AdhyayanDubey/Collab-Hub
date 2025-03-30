"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, X, Users, Crown } from "lucide-react"

interface MembersSidebarProps {
  workspaceId: string
}

// Mock data for members
const MOCK_MEMBERS = [
  { id: "user1", name: "John Doe", role: "owner", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user2", name: "Jane Smith", role: "admin", status: "idle", avatar: "/placeholder.svg?height=40&width=40" },
  {
    id: "user3",
    name: "Mike Johnson",
    role: "member",
    status: "offline",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  { id: "user4", name: "Sarah Williams", role: "member", status: "dnd", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user5", name: "Alex Brown", role: "member", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user6", name: "Emily Davis", role: "member", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user7", name: "David Wilson", role: "member", status: "idle", avatar: "/placeholder.svg?height=40&width=40" },
  {
    id: "user8",
    name: "Lisa Martinez",
    role: "member",
    status: "offline",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function MembersSidebar({ workspaceId }: MembersSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [members, setMembers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch members
    setTimeout(() => {
      setMembers(MOCK_MEMBERS)
      setIsLoading(false)
    }, 500)
  }, [workspaceId])

  const filteredMembers = members.filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const onlineMembers = filteredMembers.filter(
    (member) => member.status === "online" || member.status === "idle" || member.status === "dnd",
  )
  const offlineMembers = filteredMembers.filter((member) => member.status === "offline")

  if (!isOpen) {
    return (
      <div className="border-l bg-muted/40 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Users className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-60 border-l bg-muted/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="w-60 border-l bg-muted/40 flex flex-col">
      <div className="h-16 border-b flex items-center justify-between px-4">
        <h3 className="font-semibold">Members</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-6">
          {onlineMembers.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground px-2 mb-2">ONLINE — {onlineMembers.length}</h4>
              <div className="space-y-[2px]">
                {onlineMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                  >
                    <div className="relative mr-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-1 ring-background",
                          member.status === "online" && "bg-green-500",
                          member.status === "idle" && "bg-yellow-500",
                          member.status === "dnd" && "bg-red-500",
                        )}
                      ></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-sm font-medium truncate">{member.name}</span>
                        {member.role === "owner" && <Crown className="h-3 w-3 ml-1 text-yellow-500" />}
                      </div>
                      {member.status === "idle" && <p className="text-xs text-muted-foreground">Idle</p>}
                      {member.status === "dnd" && <p className="text-xs text-muted-foreground">Do Not Disturb</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {offlineMembers.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground px-2 mb-2">
                OFFLINE — {offlineMembers.length}
              </h4>
              <div className="space-y-[2px]">
                {offlineMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer opacity-70"
                  >
                    <div className="relative mr-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-500 ring-1 ring-background"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-sm font-medium truncate">{member.name}</span>
                        {member.role === "owner" && <Crown className="h-3 w-3 ml-1 text-yellow-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

