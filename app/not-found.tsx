import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="mx-auto max-w-xl px-4 text-center">
        <p className="mb-2 text-sm font-medium text-secondary-foreground">
          404
        </p>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-secondary-foreground">
          Page not found
        </h2>
        <p className="mb-6 text-pretty text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for
        </p>
        <Link
          href="/"
          className="px-2 py-1 text-sm font-medium text-primary transition-colors hover:text-blue-500"
        >
          Return Home
        </Link>
      </div>
    </>
  );
}
