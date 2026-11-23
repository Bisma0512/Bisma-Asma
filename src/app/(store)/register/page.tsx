import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-4xl text-espresso">Create account</h1>
      <p className="mt-2 text-sm text-taupe">
        Already have one?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-taupe">
        We validate name, email, Pakistani phone format, password strength
        (letter + number + special character), confirm-password match, and
        uniqueness of email/phone before creating your account.
      </p>
    </div>
  );
}
