import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
