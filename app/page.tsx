import { redirect } from "next/navigation"
import { getCurrentUser } from "./api/auth/actions"

export default async function Home() {
  const user = await getCurrentUser()

  // Redirect to workspaces if logged in, otherwise to login page
  if (user) {
    redirect("/workspaces")
  } else {
    redirect("/login")
  }

  // This won't be reached due to the redirects above
  return null
}

