import Link from "next/link";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { AUTH_VALIDATION_TYPES } from "@/lib/validation/auth";

export default function NewCustomerPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/customers"
          className="text-sm font-semibold text-primary"
        >
          ← Customers
        </Link>
        <h1 className="mt-2 font-display text-3xl text-espresso">
          Create customer
        </h1>
        <p className="mt-1 text-taupe">
          Same validation rules as public registration.
        </p>
      </div>
      <CustomerForm />
      <div className="max-w-xl text-sm text-taupe">
        <p className="font-semibold text-espresso">Validation applied</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {AUTH_VALIDATION_TYPES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
