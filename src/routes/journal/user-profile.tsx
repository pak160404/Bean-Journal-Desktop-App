import UserProfilePage from '@/app/user-profile/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/journal/user-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <UserProfilePage />
    </>
  )
}
