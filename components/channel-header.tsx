"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Hash, Volume2, FileText, Users, Bell, Pin, Search, Settings } from "lucide-react"

interface ChannelHeaderProps {
  channel: any
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        {channel.type === "text" && <Hash className="h-5 w-5 mr-2 text-muted-foreground" />}
        {channel.type === "voice" && <Volume2 className="h-5 w-5 mr-2 text-muted-foreground" />}
        {channel.type === "document" && <FileText className="h-5 w-5 mr-2 text-muted-foreground" />}

        <div>
          <h1 className="font-semibold text-lg">{channel.name}</h1>
          {channel.description && (
            <p className="text-xs text-muted-foreground hidden sm:block">{channel.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {channel.type === "voice" && (
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Users className="h-4 w-4 mr-2" />
            Join Voice
          </Button>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notification settings</p>
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Users className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Member list</p>
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Channel settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}

