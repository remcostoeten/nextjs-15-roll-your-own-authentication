import { NotificationDropdown } from "../notifications/NotificationDropdown";
import { AdminMessageForm } from "../notifications/AdminMessageForm";

interface NotificationsViewProps {
  isAdmin: boolean;
}

export function NotificationsView({ isAdmin }: NotificationsViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <NotificationDropdown />
      </div>

      {isAdmin && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Send Message to All Users</h2>
          <AdminMessageForm />
        </div>
      )}
    </div>
  );
} 