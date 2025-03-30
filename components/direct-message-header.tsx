"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Video, Pin, Search } from "lucide-react"

interface DirectMessageHeaderProps {
  user: any
}

export function DirectMessageHeader({ user }: DirectMessageHeaderProps) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        <div className="relative mr-2">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-1 ring-background ${
              user.status === "online"
                ? "bg-green-500"
                : user.status === "idle"
                  ? "bg-yellow-500"
                  : user.status === "dnd"
                    ? "bg-red-500"
                    : "bg-gray-500"
            }`}
          ></span>
        </div>

        <div>
          <h1 className="font-semibold text-lg">{user.name}</h1>
          <p className="text-xs text-muted-foreground">
            {user.status === "online"
              ? "Online"
              : user.status === "idle"
                ? "Idle"
                : user.status === "dnd"
                  ? "Do Not Disturb"
                  : "Offline"}
            {user.title && ` • ${user.title}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start voice call</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start video call</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pin className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pinned messages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="relative w-40 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search"
            className="h-9 w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </header>
  )
}

