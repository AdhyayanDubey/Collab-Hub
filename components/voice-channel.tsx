"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, MicOff, Headphones, Video, VideoOff, ScreenShare, Settings, PhoneOff } from "lucide-react"

interface VoiceChannelProps {
  channel: any
}

// Mock data for voice channel participants
const MOCK_PARTICIPANTS = [
  {
    id: "user1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    isSpeaking: true,
    isMuted: false,
    hasVideo: false,
    isScreenSharing: false,
  },
  {
    id: "user2",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    isSpeaking: false,
    isMuted: true,
    hasVideo: false,
    isScreenSharing: false,
  },
  {
    id: "user3",
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    isSpeaking: false,
    isMuted: false,
    hasVideo: false,
    isScreenSharing: false,
  },
]

export function VoiceChannel({ channel }: VoiceChannelProps) {
  const [participants, setParticipants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch participants
    setTimeout(() => {
      setParticipants(MOCK_PARTICIPANTS)
      setIsLoading(false)
    }, 500)
  }, [channel.id])

  const handleJoinVoice = () => {
    setIsJoined(true)

    // Add current user to participants
    const currentUser = {
      id: "current",
      name: "Current User",
      avatar: "/placeholder.svg?height=40&width=40",
      isSpeaking: false,
      isMuted: isMuted,
      hasVideo: hasVideo,
      isScreenSharing: isScreenSharing,
    }

    setParticipants([...participants, currentUser])
  }

  const handleLeaveVoice = () => {
    setIsJoined(false)

    // Remove current user from participants
    setParticipants(participants.filter((p) => p.id !== "current"))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)

    // Update current user in participants
    setParticipants(participants.map((p) => (p.id === "current" ? { ...p, isMuted: !isMuted } : p)))
  }

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened)
  }

  const toggleVideo = () => {
    setHasVideo(!hasVideo)

    // Update current user in participants
    setParticipants(participants.map((p) => (p.id === "current" ? { ...p, hasVideo: !hasVideo } : p)))
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)

    // Update current user in participants
    setParticipants(participants.map((p) => (p.id === "current" ? { ...p, isScreenSharing: !isScreenSharing } : p)))
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
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-8">Voice Channel: {channel.name}</h2>

          <div className="space-y-4 mb-8">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center p-3 rounded-lg ${participant.isSpeaking ? "bg-primary/10 border border-primary/30" : "bg-muted"}`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {participant.isMuted && (
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                      <MicOff className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">{participant.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {participant.isSpeaking ? "Speaking" : "Not speaking"}
                  </div>
                </div>
                {participant.hasVideo && <Video className="h-5 w-5 text-primary mr-2" />}
                {participant.isScreenSharing && <ScreenShare className="h-5 w-5 text-primary" />}
              </div>
            ))}

            {participants.length === 0 && !isJoined && (
              <div className="text-center text-muted-foreground">
                <p>No one is in this channel yet.</p>
                <p>Join to start a conversation!</p>
              </div>
            )}
          </div>

          {!isJoined ? (
            <Button className="w-full" onClick={handleJoinVoice}>
              Join Voice Channel
            </Button>
          ) : (
            <div className="flex justify-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={isMuted ? "destructive" : "outline"} size="icon" onClick={toggleMute}>
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isMuted ? "Unmute" : "Mute"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={isDeafened ? "destructive" : "outline"} size="icon" onClick={toggleDeafen}>
                      <Headphones className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isDeafened ? "Undeafen" : "Deafen"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={hasVideo ? "default" : "outline"} size="icon" onClick={toggleVideo}>
                      {hasVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{hasVideo ? "Turn off camera" : "Turn on camera"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={isScreenSharing ? "default" : "outline"} size="icon" onClick={toggleScreenShare}>
                      <ScreenShare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voice settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" size="icon" onClick={handleLeaveVoice}>
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Disconnect</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

