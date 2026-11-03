import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-16 max-w-xl">
      <p className="label text-muted mb-3">404</p>
      <h1 className="text-3xl leading-tight">That piece isn&apos;t here.</h1>
      <p className="mt-4 text-muted">It may have sold, or the link is wrong.</p>
      <Link href="/shop" className="label inline-block mt-10 underline underline-offset-4">Back to the shop</Link>
    </section>
  );
}
