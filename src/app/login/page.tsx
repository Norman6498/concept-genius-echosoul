import { Metadata } from "next";
import { AuthRealm } from "@/components/auth/AuthRealm";

export const metadata: Metadata = {
  title: "EchoSoul — Sign In | Welcome Back to Your Sanctuary",
  description: "Sign in to EchoSoul to continue your conversations, reflection, and journey.",
};

export default function LoginPage() {
  return <AuthRealm initialMode="login" />;
}
