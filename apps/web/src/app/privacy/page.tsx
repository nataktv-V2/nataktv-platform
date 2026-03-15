import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Natak TV",
  description: "Privacy Policy for Natak TV streaming platform.",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: March 15, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section>
            <p className="text-zinc-300 leading-relaxed">
              Natak TV (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operated by INDIDINO VENTURES
              PRIVATE LIMITED, is committed to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our website, mobile
              application, and related services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-2">
              <li>
                <strong>Account information:</strong> When you register, we collect your name, email address,
                and any other details you provide.
              </li>
              <li>
                <strong>Payment information:</strong> Subscription payments are processed by Razorpay. We do
                not store full card numbers on our servers; we may retain billing-related information (e.g.,
                transaction IDs, plan type) as needed for accounting and support.
              </li>
              <li>
                <strong>Usage data:</strong> We collect information about how you use the service, including
                which content you watch, device type, and general usage patterns to improve the service and
                personalize your experience.
              </li>
              <li>
                <strong>Technical data:</strong> We may collect IP address, browser or app version, and
                similar technical information for security, analytics, and troubleshooting.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-zinc-300 leading-relaxed mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process subscriptions and communicate about your account.</li>
              <li>Send important service updates, and with your consent, marketing communications.</li>
              <li>Understand usage and improve content, features, and performance.</li>
              <li>Enforce our terms, prevent fraud, and protect the security of our platform.</li>
              <li>Comply with applicable laws and respond to lawful requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Sharing of Information</h2>
            <p className="text-zinc-300 leading-relaxed mb-2">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>
                Service providers (e.g., hosting, payment processing, analytics) who assist us in operating
                the service, under strict confidentiality and data-processing agreements.
              </li>
              <li>
                Law enforcement or other authorities when required by law or to protect our rights and safety.
              </li>
              <li>Other parties only with your consent or as otherwise described in this policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Retention</h2>
            <p className="text-zinc-300 leading-relaxed">
              We retain your account and usage data for as long as your account is active and as needed to
              provide the service, resolve disputes, enforce agreements, and comply with legal obligations.
              You may request deletion of your account and associated data subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
            <p className="text-zinc-300 leading-relaxed">
              Depending on your location, you may have the right to access, correct, or delete your personal
              data, object to or restrict certain processing, and data portability. To exercise these rights
              or ask questions, contact us at{" "}
              <a href="mailto:officialnataktv@gmail.com" className="text-accent hover:underline">
                officialnataktv@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Children&apos;s Privacy</h2>
            <p className="text-zinc-300 leading-relaxed">
              We do not knowingly collect personal information from children under 13 (or the applicable age
              of digital consent) without verified parental consent. See our{" "}
              <Link href="/terms" className="text-accent hover:underline">Terms and Conditions</Link>{" "}
              for our child safety commitment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Security</h2>
            <p className="text-zinc-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
            <p className="text-zinc-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will indicate the &quot;Last
              updated&quot; date and, where required, notify you of material changes. Continued use of the
              service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p className="text-zinc-300 leading-relaxed">
              For privacy-related questions or requests, contact us at:{" "}
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
          <Link href="/privacy" className="text-accent">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link>
          <Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link>
          <Link href="/delete-account" className="hover:text-accent transition-colors">Delete Account</Link>
        </div>
      </footer>
    </div>
  );
}
