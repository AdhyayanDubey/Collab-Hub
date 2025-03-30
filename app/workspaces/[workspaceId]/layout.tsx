import type { ReactNode } from "react"
import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { MembersSidebar } from "@/components/members-sidebar"

interface WorkspaceLayoutProps {
  children: ReactNode
  params: {
    workspaceId: string
  }
}

export default function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <WorkspaceSidebar workspaceId={params.workspaceId} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      <MembersSidebar workspaceId={params.workspaceId} />
    </div>
  )
}

