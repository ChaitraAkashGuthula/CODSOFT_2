import { TrackerView } from "@/components/tracker/TrackerView";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function DynamicTrackPage({ params }: PageProps) {
  const { orderId } = await params;
  return <TrackerView initialOrderId={orderId} />;
}
