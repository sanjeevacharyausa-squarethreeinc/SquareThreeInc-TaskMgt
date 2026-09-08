import { redirect } from "next/navigation";

// Middleware already gates every route by auth state, so this just picks a
// sensible landing spot.
export default function RootPage() {
  redirect("/dashboard");
}
