import TodoPage from '@/app/todo/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/journal/todo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TodoPage />
}
