import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/journal/bean-journey')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/journal/bean-journey"!</div>
}
