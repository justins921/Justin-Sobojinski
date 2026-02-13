import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-500">Page not found.</p>
      <Link href="/" className="btn-primary mt-8">
        Go Home
      </Link>
    </div>
  );
}
