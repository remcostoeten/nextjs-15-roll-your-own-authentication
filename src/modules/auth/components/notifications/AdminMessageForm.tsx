import { useState } from "react";
import { sendAdminNotification } from "../../api/mutations/send-admin-notification";

export function AdminMessageForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await sendAdminNotification({
        title,
        message,
      });

      if (result.success) {
        setSuccess(true);
        setTitle("");
        setMessage("");
      } else {
        setError(result.error?.message || "Failed to send notification");
      }
    } catch (error) {
      setError("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600">
          Message sent successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isSending}
        className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isSending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSending ? "Sending..." : "Send to All Users"}
      </button>
    </form>
  );
} 