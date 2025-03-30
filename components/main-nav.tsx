"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Bell, MessageSquare } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          <span className="text-primary">Collab</span>Hub
        </span>
      </Link>
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Button variant="ghost" className={cn("h-9 px-2", pathname === "/workspaces" && "bg-muted")} asChild>
          <Link href="/workspaces">
            <Home className="h-4 w-4 mr-2" />
            <span>Home</span>
          </Link>
        </Button>
        <Button variant="ghost" className={cn("h-9 px-2", pathname === "/direct-messages" && "bg-muted")} asChild>
          <Link href="/direct-messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Messages</span>
          </Link>
        </Button>
        <Button variant="ghost" className={cn("h-9 px-2", pathname === "/friends" && "bg-muted")} asChild>
          <Link href="/friends">
            <Users className="h-4 w-4 mr-2" />
            <span>Friends</span>
          </Link>
        </Button>
        <Button variant="ghost" className={cn("h-9 px-2", pathname === "/notifications" && "bg-muted")} asChild>
          <Link href="/notifications">
            <Bell className="h-4 w-4 mr-2" />
            <span>Notifications</span>
          </Link>
        </Button>
      </nav>
    </div>
  )
}

