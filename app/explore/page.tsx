"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import { Search, Users, Hash, Compass, Sparkles, TrendingUp, Star, Zap, ArrowRight, Plus } from "lucide-react"

// Mock data for featured workspaces
const FEATURED_WORKSPACES = [
  {
    id: "ws1",
    name: "Design Community",
    description: "A community for UI/UX designers to share work and get feedback",
    members: 1250,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#10b981",
    categories: ["Design", "UI/UX", "Feedback"],
    featured: true,
  },
  {
    id: "ws2",
    name: "Developer Hub",
    description: "Connect with developers, share code, and collaborate on projects",
    members: 3420,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#3b82f6",
    categories: ["Development", "Coding", "Open Source"],
    featured: true,
  },
  {
    id: "ws3",
    name: "Marketing Pros",
    description: "Digital marketing strategies, tips, and networking",
    members: 875,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#8b5cf6",
    categories: ["Marketing", "Digital", "Strategy"],
    featured: true,
  },
  {
    id: "ws4",
    name: "Startup Founders",
    description: "A community for startup founders to connect and share experiences",
    members: 1640,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#f59e0b",
    categories: ["Startups", "Entrepreneurship", "Business"],
    featured: true,
  },
]

// Mock data for trending workspaces
const TRENDING_WORKSPACES = [
  {
    id: "ws5",
    name: "AI Enthusiasts",
    description: "Discussions about artificial intelligence, machine learning, and more",
    members: 2150,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#ec4899",
    categories: ["AI", "Machine Learning", "Technology"],
    trending: true,
  },
  {
    id: "ws6",
    name: "Remote Work Hub",
    description: "Resources and community for remote workers and digital nomads",
    members: 1890,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#06b6d4",
    categories: ["Remote Work", "Digital Nomad", "Productivity"],
    trending: true,
  },
  {
    id: "ws7",
    name: "Game Developers",
    description: "For game developers to share knowledge and collaborate",
    members: 3210,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#ef4444",
    categories: ["Game Dev", "Unity", "Unreal Engine"],
    trending: true,
  },
  {
    id: "ws8",
    name: "Crypto & Web3",
    description: "Discussions about blockchain, cryptocurrencies, and web3 technologies",
    members: 4320,
    avatar: "/placeholder.svg?height=64&width=64",
    color: "#f97316",
    categories: ["Crypto", "Blockchain", "Web3"],
    trending: true,
  },
]

// Mock data for categories
const CATEGORIES = [
  { id: "cat1", name: "Design", count: 245, icon: "🎨" },
  { id: "cat2", name: "Development", count: 312, icon: "💻" },
  { id: "cat3", name: "Marketing", count: 178, icon: "📈" },
  { id: "cat4", name: "Business", count: 203, icon: "💼" },
  { id: "cat5", name: "Education", count: 156, icon: "📚" },
  { id: "cat6", name: "Gaming", count: 289, icon: "🎮" },
  { id: "cat7", name: "Technology", count: 342, icon: "🔧" },
  { id: "cat8", name: "Art", count: 124, icon: "🖌️" },
  { id: "cat9", name: "Music", count: 167, icon: "🎵" },
  { id: "cat10", name: "Science", count: 132, icon: "🔬" },
  { id: "cat11", name: "Health", count: 98, icon: "🏥" },
  { id: "cat12", name: "Finance", count: 112, icon: "💰" },
]

export default function ExplorePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredWorkspaces, setFeaturedWorkspaces] = useState(FEATURED_WORKSPACES)
  const [trendingWorkspaces, setTrendingWorkspaces] = useState(TRENDING_WORKSPACES)

  const handleJoinWorkspace = (workspaceId: string, workspaceName: string) => {
    toast({
      title: "Workspace joined",
      description: `You have joined ${workspaceName}.`,
    })

    // In a real implementation, this would navigate to the workspace
    router.push(`/workspaces/${workspaceId}`)
  }

  const filteredFeatured = featuredWorkspaces.filter(
    (workspace) =>
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredTrending = trendingWorkspaces.filter(
    (workspace) =>
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
              <p className="text-muted-foreground">Discover new workspaces and communities</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workspaces..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Hero section */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="p-6 md:p-8 md:w-3/5">
                <Badge className="mb-4" variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Find your community</h2>
                <p className="text-muted-foreground mb-6">
                  Join workspaces that match your interests and connect with like-minded people from around the world.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline">Design</Badge>
                  <Badge variant="outline">Development</Badge>
                  <Badge variant="outline">Marketing</Badge>
                  <Badge variant="outline">Business</Badge>
                  <Badge variant="outline">Education</Badge>
                  <Badge variant="outline">Gaming</Badge>
                  <Badge variant="outline">+100 more</Badge>
                </div>
                <Button onClick={() => router.push("/workspaces/create")}>
                  Create a Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="md:w-2/5 bg-muted">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Explore communities"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="featured">
            <TabsList className="mb-4">
              <TabsTrigger value="featured">
                <Sparkles className="h-4 w-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Hash className="h-4 w-4 mr-2" />
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-4">
              {filteredFeatured.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {filteredFeatured.map((workspace) => (
                    <Card key={workspace.id} className="overflow-hidden">
                      <div className="h-3" style={{ backgroundColor: workspace.color }}></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border-2" style={{ borderColor: workspace.color }}>
                              <AvatarImage src={workspace.avatar} alt={workspace.name} />
                              <AvatarFallback style={{ backgroundColor: workspace.color }}>
                                {workspace.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="flex items-center">
                                {workspace.name}
                                {workspace.featured && (
                                  <Badge variant="secondary" className="ml-2">
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    Featured
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">{workspace.description}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {workspace.categories.map((category) => (
                            <Badge key={category} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{workspace.members.toLocaleString()} members</span>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 pt-2">
                        <Button className="w-full" onClick={() => handleJoinWorkspace(workspace.id, workspace.name)}>
                          <Zap className="mr-2 h-4 w-4" />
                          Join Workspace
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Compass className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No workspaces found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {searchQuery ? "Try a different search term" : "No featured workspaces available right now"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              {filteredTrending.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {filteredTrending.map((workspace) => (
                    <Card key={workspace.id} className="overflow-hidden">
                      <div className="h-3" style={{ backgroundColor: workspace.color }}></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border-2" style={{ borderColor: workspace.color }}>
                              <AvatarImage src={workspace.avatar} alt={workspace.name} />
                              <AvatarFallback style={{ backgroundColor: workspace.color }}>
                                {workspace.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="flex items-center">
                                {workspace.name}
                                {workspace.trending && (
                                  <Badge variant="secondary" className="ml-2">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">{workspace.description}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {workspace.categories.map((category) => (
                            <Badge key={category} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{workspace.members.toLocaleString()} members</span>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 pt-2">
                        <Button className="w-full" onClick={() => handleJoinWorkspace(workspace.id, workspace.name)}>
                          <Zap className="mr-2 h-4 w-4" />
                          Join Workspace
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <TrendingUp className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No trending workspaces found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {searchQuery ? "Try a different search term" : "No trending workspaces available right now"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {CATEGORIES.map((category) => (
                  <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} workspaces</p>
                      <Button variant="outline" className="mt-4 w-full" onClick={() => setSearchQuery(category.name)}>
                        Browse
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">Create Category</h3>
                    <p className="text-sm text-muted-foreground">Suggest a new category</p>
                    <Button variant="outline" className="mt-4 w-full">
                      Suggest
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

