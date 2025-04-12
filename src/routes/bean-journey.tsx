import { createFileRoute } from "@tanstack/react-router";
import { BeanJourneyPage } from "@/components/bean-journey/BeanJourneyPage";

export const Route = createFileRoute("/bean-journey")({
  component: BeanJourneyPage
}); 