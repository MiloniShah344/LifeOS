import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

// This is a Server Component — it just renders the client form component
export default function LoginPage() {
  return <LoginForm />;
}