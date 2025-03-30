"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Search, Bell, Pin, Users, Settings } from "lucide-react"

interface WorkspaceHeaderProps {
  workspace: any
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  const handleInvite = () => {
    setIsInviting(true)

    // Simulate API call to invite user
    setTimeout(() => {
      setIsInviting(false)
      setIsInviteDialogOpen(false)
      setInviteEmail("")

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}.`,
      })
    }, 1000)
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg">{workspace.name}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-8 h-9" />
        </div>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Users className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite to {workspace.name}</DialogTitle>
              <DialogDescription>Invite someone to join your workspace.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail || isInviting}>
                {isInviting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Pin className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <a href={`/workspaces/${workspace.id}/settings`}>
            <Settings className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </header>
  )
}

