import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Natak TV",
  description: "Terms and Conditions for using Natak TV streaming platform.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: March 15, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              By accessing or using Natak TV (website and mobile application) operated by INDIDINO VENTURES
              PRIVATE LIMITED, you agree to be bound by these Terms & Conditions. If you do not agree,
              please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
            <p className="text-zinc-300 leading-relaxed">
              Natak TV is a subscription-based video streaming platform offering Indian dramas, short films,
              and web series. Content is delivered via YouTube embedded players. Access to content requires
              an active subscription.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Account & Authentication</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>You must sign in using Google Sign-In to access the platform.</li>
              <li>You are responsible for maintaining the security of your Google account.</li>
              <li>One account per person. Account sharing is not permitted.</li>
              <li>You must be at least 13 years old to use Natak TV.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Subscription & Payments</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Natak TV offers a subscription plan at ₹199/month with a ₹2 trial for 2 days.</li>
              <li>Payments are processed securely through Razorpay.</li>
              <li>Subscriptions auto-renew monthly unless cancelled.</li>
              <li>You can cancel your subscription anytime from your profile page.</li>
              <li>Upon cancellation, you retain access until the end of your current billing period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Content Usage</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>All content on Natak TV is for personal, non-commercial use only.</li>
              <li>You may not download, copy, distribute, or publicly display any content.</li>
              <li>Content availability may change without notice.</li>
              <li>We reserve the right to modify, suspend, or discontinue any content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Prohibited Activities</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Using bots, scrapers, or automated tools to access the service</li>
              <li>Attempting to bypass subscription or payment systems</li>
              <li>Sharing your account credentials with others</li>
              <li>Using VPN or proxy to misrepresent your location</li>
              <li>Any activity that disrupts or interferes with the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
            <p className="text-zinc-300 leading-relaxed">
              All content, trademarks, logos, and intellectual property on Natak TV belong to INDIDINO VENTURES
              PRIVATE LIMITED or its content licensors. Unauthorized use is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="text-zinc-300 leading-relaxed">
              Natak TV is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
              indirect, incidental, or consequential damages arising from your use of the service. Our total
              liability shall not exceed the amount paid by you in the last 3 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
            <p className="text-zinc-300 leading-relaxed">
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
              jurisdiction of courts in Bengaluru, Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p className="text-zinc-300 leading-relaxed">
              For questions about these terms, contact us at:{" "}
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
          <Link href="/terms" className="text-accent">Terms & Conditions</Link>
          <Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link>
          <Link href="/delete-account" className="hover:text-accent transition-colors">Delete Account</Link>
        </div>
      </footer>
    </div>
  );
}
