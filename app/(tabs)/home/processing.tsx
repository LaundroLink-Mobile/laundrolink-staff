// app/(tabs)/processing.tsx
import StatusScreen from "@/components/StatusScreen";

export default function Processing() {
  // Pass a group of statuses instead of a single one
  return (
    <StatusScreen
      title="Processing"
      statusKey={["Processing", "Washed", "Steam Pressed/Ironed", "Folded", "Out for Delivery"]}
    />
  );
}
