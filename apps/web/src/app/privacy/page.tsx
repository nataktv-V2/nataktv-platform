import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Natak TV",
  description: "Privacy Policy for Natak TV — how we collect, use, and protect your data.",
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
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-zinc-300 leading-relaxed">
              INDIDINO VENTURES PRIVATE LIMITED (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;) operates the Natak TV platform
              (website at nataktv.com and mobile application). This Privacy Policy explains how we collect,
              use, and protect your personal information when you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <p className="text-zinc-300 leading-relaxed mb-2">When you use Natak TV, we may collect:</p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, and profile photo provided via Google Sign-In.</li>
              <li><strong>Payment Information:</strong> Subscription and payment details processed securely through Razorpay. We do not store your card details.</li>
              <li><strong>Usage Data:</strong> Watch history, search queries, and content preferences to improve your experience.</li>
              <li><strong>Device Information:</strong> Device type, operating system, and browser type for app optimization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>To provide and maintain our streaming service</li>
              <li>To process your subscription and payments</li>
              <li>To personalize your content recommendations</li>
              <li>To communicate service updates and offers</li>
              <li>To improve our platform and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-zinc-300 leading-relaxed">
              We implement industry-standard security measures to protect your data. Authentication is handled
              through Google Firebase, and payments are processed through Razorpay&apos;s PCI-DSS compliant
              infrastructure. Your data is stored on secure servers with encryption at rest and in transit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
            <p className="text-zinc-300 leading-relaxed mb-2">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li><strong>Google Firebase:</strong> Authentication and user management</li>
              <li><strong>Razorpay:</strong> Payment processing</li>
              <li><strong>YouTube:</strong> Video content delivery via embedded player</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-2">
              Each service has its own privacy policy governing the use of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-zinc-300 leading-relaxed mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
            <p className="text-zinc-300 leading-relaxed">
              We retain your data for as long as your account is active. Upon account deletion, your personal
              data will be removed within 30 days, except where required by law for tax or legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              For privacy-related queries, contact us at:{" "}
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
