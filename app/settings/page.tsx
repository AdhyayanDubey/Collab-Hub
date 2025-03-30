"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import {
  User,
  Bell,
  Shield,
  Keyboard,
  Monitor,
  Volume2,
  Moon,
  Sun,
  Languages,
  LogOut,
  Save,
  Trash2,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  
  // User settings
  const [settings, setSettings] = useState({
    account: {
      email: "john.doe@example.com",
      username: "johndoe",
      phone: "+1 (555) 123-4567"
    },
    appearance: {
      theme: "system",
      fontSize: "medium",
      messageDisplay: "cozy",
      enableAnimations: true
    },
    notifications: {
      enableAll: true,
      mentions: true,
      directMessages: true,
      teamMentions: true,
      sounds: true,
      mobile: true,
      emailNotifications: false
    },
    privacy: {
      allowDirectMessages: "everyone",
      allowFriendRequests: "everyone",
      showCurrentActivity: true,
      showOnlineStatus: true
    },
    audio: {
      inputDevice: "default",
      outputDevice: "default",
      inputVolume: 80,
      outputVolume: 70,
      automaticGainControl: true,
      echoCancellation: true,
      noiseSuppression: true
    },
    language: "en-US",
    keybinds: {
      toggleMute: "M",
      toggleDeafen: "D",
      openSettings: "Ctrl+,",
      navigateBack: "Esc"
    }
  })
  
  const handleSaveSettings = (section: string) => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      
      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been updated.`,
      })
    }, 1000)
  }
  
  const handleDeleteAccount = () => {
    // This would show a confirmation dialog in a real implementation
    toast({
      title: "Account deletion requested",
      description: "We've sent a confirmation email to your registered email address.",
      variant: "destructive"
    })
  }
  
  const handleLogout = () => {
    router.push("/login")
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
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
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
          
          <Tabs defaultValue="account" className="w-full">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <TabsList className="flex flex-col h-auto p-0 bg-transparent space-y-1">
                  <TabsTrigger value="account" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <Monitor className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Safety
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Audio & Video
                  </TabsTrigger>
                  <TabsTrigger value="keybinds" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <Keyboard className="h-4 w-4 mr-2" />
                    Keybinds
                  </TabsTrigger>
                  <TabsTrigger value="language" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <Languages className="h-4 w-4 mr-2" />
                    Language
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
              
              <div className="md:w-3/4 space-y-6">
                <TabsContent value="account" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Update your account information and manage your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={settings.account.email} 
                          onChange={(e) => setSettings({
                            ...settings,
                            account: { ...settings.account, email: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={settings.account.username} 
                          onChange={(e) => setSettings({
                            ...settings,
                            account: { ...settings.account, username: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={settings.account.phone} 
                          onChange={(e) => setSettings({
                            ...settings,
                            account: { ...settings.account, phone: e.target.value }
                          })}
                        />
                        <p className="text-sm text-muted-foreground">
                          Used for account recovery and two-factor authentication.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleSaveSettings('account')} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password to keep your account secure.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Change Password</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-destructive">Danger Zone</CardTitle>
                      <CardDescription>Permanently delete your account and all of your data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. This action cannot be undone.
                      </p>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Theme</CardTitle>
                      <CardDescription>Customize the appearance of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div 
                            className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${settings.appearance.theme === 'light' ? 'border-primary' : 'border-border'}`}
                            onClick={() => setSettings({
                              ...settings,
                              appearance: { ...settings.appearance, theme: 'light' }
                            })}
                          >
                            <Sun className="h-6 w-6 mb-2" />
                            <span>Light</span>
                          </div>
                          <div 
                            className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${settings.appearance.theme === 'dark' ? 'border-primary' : 'border-border'}`}
                            onClick={() => setSettings({
                              ...settings,
                              appearance: { ...settings.appearance, theme: 'dark' }
                            })}
                          >
                            <Moon className="h-6 w-6 mb-2" />
                            <span>Dark</span>
                          </div>
                          <div 
                            className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${settings.appearance.theme === 'system' ? 'border-primary' : 'border-border'}`}
                            onClick={() => setSettings({
                              ...settings,
                              appearance: { ...settings.appearance, theme: 'system' }
                            })}
                          >
                            <Monitor className="h-6 w-6 mb-2" />
                            <span>System</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="font-size">Font Size</Label>
                        <Select 
                          value={settings.appearance.fontSize}
                          onValueChange={(value) => setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, fontSize: value }
                          })}
                        >
                          <SelectTrigger id="font-size">
                            <SelectValue placeholder="Select font size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message-display">Message Display</Label>
                        <Select 
                          value={settings.appearance.messageDisplay}
                          onValueChange={(value) => setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, messageDisplay: value }
                          })}
                        >
                          <SelectTrigger id="message-display">
                            <SelectValue placeholder="Select message display" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cozy">Cozy</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="animations">Enable Animations</Label>
                          <p className="text-sm text-muted-foreground">
                            Show animations and effects throughout the application
                          </p>
                        </div>
                        <Switch
                          id="animations"
                          checked={settings.appearance.enableAnimations}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, enableAnimations: checked }
                          })}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleSaveSettings('appearance')} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Configure how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enable-all">Enable All Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive all notifications from the application
                          </p>
                        </div>
                        <Switch
                          id="enable-all"
                          checked={settings.notifications.enableAll}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, enableAll: checked }
                          })}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Notification Types</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="mentions">Direct Mentions</Label>
                            <p className="text-sm text-muted-foreground">
                              When someone mentions you directly
                            </p>
                          </div>
                          <Switch
                            id="mentions"
                            checked={settings.notifications.mentions}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, mentions: checked }
                            })}
                            disabled={!settings.notifications.enableAll}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="direct-messages">Direct Messages</Label>
                            <p className="text-sm text-muted-foreground">
                              When you receive a direct message
                            </p>
                          </div>
                          <Switch
                            id="direct-messages"
                            checked={settings.notifications.directMessages}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, directMessages: checked }
                            })}
                            disabled={!settings.notifications.enableAll}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="team-mentions">Team Mentions</Label>
                            <p className="text-sm text-muted-foreground">
                              When someone mentions @everyone or @here
                            </p>
                          </div>
                          <Switch
                            id="team-mentions"
                            checked={settings.notifications.teamMentions}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, teamMentions: checked }
                            })}
                            disabled={!settings.notifications.enableAll}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Notification Delivery</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sounds">Notification Sounds</Label>
                            <p className="text-sm text-muted-foreground">
                              Play sounds for notifications
                            </p>
                          </div>
                          <Switch
                            id="sounds"
                            checked={settings.notifications.sounds}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, sounds: checked }
                            })}
                            disabled={!settings.notifications.enableAll}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="mobile">Mobile Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications on your mobile device
                            </p>
                          </div>
                          <Switch
                            id="mobile"
                            checked={settings.notifications.mobile}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, mobile: checked }
                            })}
                            disabled={!settings.notifications.enableAll}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={settings.notifications.emailNotifications}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, emailNotifications: checked }
                            })}
                            disabled={!settings.notifications.enableAll}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleSaveSettings('notifications')} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="privacy" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Manage your privacy and safety preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="direct-messages">Who can send you direct messages</Label>
                        <Select 
                          value={settings.privacy.allowDirectMessages}
                          onValueChange={(value) => setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, allowDirectMessages: value }
                          })}
                        >
                          <SelectTrigger id="direct-messages">
                            <SelectValue placeholder="Select who can message you" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="none">No One</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="friend-requests">Who can send you friend requests</Label>
                        <Select 
                          value={settings.privacy.allowFriendRequests}
                          onValueChange={(value) => setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, allowFriendRequests: value }
                          })}
                        >
                          <SelectTrigger id="friend-requests">
                            <SelectValue placeholder="Select who can send friend requests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="mutual">Friends of Friends</SelectItem>
                            <SelectItem value="none">No One</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-activity">Show Current Activity</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow others to see what you're currently doing
                          </p>
                        </div>
                        <div className="flex items-center">
                          {settings.privacy.showCurrentActivity ? (
                            <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
                          )}
                          <Switch
                            id="show-activity"
                            checked={settings.privacy.showCurrentActivity}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              privacy: { ...settings.privacy, showCurrentActivity: checked }
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="online-status">Show Online Status</Label>
                          <p className="text-sm text-muted-foreground">
                            Show others when you're online
                          </p>
                        </div>
                        <div className="flex items-center">
                          {settings.privacy.showOnlineStatus ? (
                            <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
                          )}
                          <Switch
                            id="online-status"
                            checked={settings.privacy.showOnlineStatus}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              privacy: { ...settings.privacy, showOnlineStatus: checked }
                            })}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleSaveSettings('privacy')} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="audio" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Audio & Video Settings</CardTitle>
                      <CardDescription>Configure your audio and video devices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Input Devices</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="input-device">Microphone</Label>
                          <Select 
                            value={settings.audio.inputDevice}
                            onValueChange={(value) => setSettings({
                              ...settings,
                              audio: { ...settings.audio, inputDevice: value }
                            })}
                          >
                            <SelectTrigger id="input-device">
                              <SelectValue placeholder="Select input device" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default Microphone</SelectItem>
                              <SelectItem value="mic1">Built-in Microphone</SelectItem>
                              <SelectItem value="mic2">External Microphone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="input-volume">Input Volume</Label>
                            <span className="text-sm">{settings.audio.inputVolume}%</span>
                          </div>
                          <input 
                            type="range"
\

