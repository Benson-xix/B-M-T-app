import { toast } from "sonner";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export async function registerAdmin(data: {
  full_name: string;
  email: string;
  password: string;
  admin_role?: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(message);
    }

    return await res.json();
  } catch (err) {
    toast.error("Registration failed", {
      description: (err as Error).message,
    });
    throw err;
  }
}
