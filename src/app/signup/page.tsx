import { Metadata } from "next";
import { AuthRealm } from "@/components/auth/AuthRealm";

export const metadata: Metadata = {
  title: "EchoSoul — Create Your Account | Enter Your Realm",
  description: "Join EchoSoul and take the first step towards understanding, healing, and becoming the story you're proud of.",
};

export default function SignupPage() {
  return <AuthRealm initialMode="signup" />;
}
