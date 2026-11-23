import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-4xl text-espresso">Sign in</h1>
      <p className="mt-2 text-sm text-taupe">
        New here?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
      <div className="mt-8">
        <LoginForm nextPath={next || "/account"} />
      </div>
    </div>
  );
}
