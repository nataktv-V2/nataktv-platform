import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Natak TV",
  description: "Refund and cancellation policy for Natak TV subscriptions.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            <span className="bg-gradient-to-r from-brand-yellow via-brand-orange via-brand-pink to-brand-purple bg-clip-text text-transparent">
              Natak
            </span>
            <span className="ml-1 bg-brand-purple text-white text-xs px-1.5 py-0.5 rounded font-semibold">
              TV
            </span>
          </Link>
          <Link href="/" className="text-sm text-text-muted hover:text-accent transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Refund & Cancellation Policy</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: March 15, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section>
            <p className="text-zinc-300 leading-relaxed">
              Natak TV believes in helping its customers as far as possible, and has therefore a liberal
              cancellation policy. Under this policy:
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Cancellation</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Cancellations will be considered only if the request is made within 1 day of buying the subscription.</li>
              <li>You can cancel your subscription at any time from your profile page.</li>
              <li>Upon cancellation, your access continues until the end of the current billing period.</li>
              <li>No partial refunds are provided for unused days within a billing period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Trial Period</h2>
            <p className="text-zinc-300 leading-relaxed">
              Natak TV offers a 2-day trial for ₹2. During the trial period, you have full access to all
              content. The trial payment of ₹2 is non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Refund Processing</h2>
            <p className="text-zinc-300 leading-relaxed">
              In case of any refunds approved by Natak TV, it will take 3–5 business days for the refund to
              be credited to the end customer. Refunds will be credited to the original payment method via
              Razorpay.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Non-Refundable Cases</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Trial payment of ₹2</li>
              <li>Partial month usage after cancellation</li>
              <li>Dissatisfaction with content catalog</li>
              <li>Inability to use the service due to your internet connection or device compatibility</li>
              <li>Account suspension due to terms violation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. How to Request a Refund</h2>
            <p className="text-zinc-300 leading-relaxed">
              To request a refund, email us at{" "}
              <a href="mailto:officialnataktv@gmail.com" className="text-accent hover:underline">
                officialnataktv@gmail.com
              </a>{" "}
              with the following details:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1 mt-2">
              <li>Your registered email address</li>
              <li>Date of the transaction</li>
              <li>Reason for the refund request</li>
              <li>Any supporting screenshots or documentation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
            <p className="text-zinc-300 leading-relaxed">
              For refund or cancellation queries:{" "}
              <a href="mailto:officialnataktv@gmail.com" className="text-accent hover:underline">
                officialnataktv@gmail.com
              </a>
            </p>
            <p className="text-zinc-300 leading-relaxed mt-2">
              INDIDINO VENTURES PRIVATE LIMITED<br />
              Bengaluru, Karnataka, India
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-wrap gap-4 text-sm text-text-muted">
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link>
          <Link href="/refund" className="text-accent">Refund Policy</Link>
          <Link href="/delete-account" className="hover:text-accent transition-colors">Delete Account</Link>
        </div>
      </footer>
    </div>
  );
}
