import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete Account | Natak TV",
  description: "How to delete your Natak TV account and all associated data.",
};

export default function DeleteAccountPage() {
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
        <h1 className="text-3xl font-bold mb-2">Delete Your Account</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: March 15, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">What Happens When You Delete Your Account</h2>
            <p className="text-zinc-300 leading-relaxed mb-2">
              When you request account deletion, the following data will be permanently removed:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Your profile information (name, email, photo)</li>
              <li>Watch history and preferences</li>
              <li>Subscription records</li>
              <li>All associated data stored on our servers</li>
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
              <p className="text-yellow-400 text-sm font-medium">
                This action is irreversible. Once deleted, your data cannot be recovered.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Before You Delete</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li><strong>Cancel your subscription first</strong> — Go to Profile &gt; Cancel Subscription to avoid future charges.</li>
              <li><strong>Active subscription?</strong> — You will lose access immediately upon deletion, even if you have remaining days.</li>
              <li><strong>No refunds</strong> — Account deletion does not qualify for a refund of unused subscription time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How to Delete Your Account</h2>

            <div className="space-y-4">
              <div className="bg-bg-surface border border-border-subtle rounded-lg p-4">
                <h3 className="font-semibold text-[#f97316] mb-2">Option 1: From the App</h3>
                <ol className="list-decimal pl-6 text-zinc-300 space-y-1">
                  <li>Open Natak TV and go to your Profile</li>
                  <li>Scroll down and tap &quot;Delete Account&quot;</li>
                  <li>Confirm the deletion when prompted</li>
                  <li>Your account will be deleted within 24 hours</li>
                </ol>
              </div>

              <div className="bg-bg-surface border border-border-subtle rounded-lg p-4">
                <h3 className="font-semibold text-[#f97316] mb-2">Option 2: Via Email</h3>
                <ol className="list-decimal pl-6 text-zinc-300 space-y-1">
                  <li>
                    Send an email to{" "}
                    <a href="mailto:officialnataktv@gmail.com" className="text-accent hover:underline">
                      officialnataktv@gmail.com
                    </a>
                  </li>
                  <li>Subject line: &quot;Account Deletion Request&quot;</li>
                  <li>Include the email address associated with your account</li>
                  <li>Your account will be deleted within 48 hours of verification</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Retention After Deletion</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Personal data is deleted within 30 days of the request.</li>
              <li>Payment records may be retained for up to 7 years as required by Indian tax laws.</li>
              <li>Anonymized usage analytics may be retained for service improvement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Re-Registration</h2>
            <p className="text-zinc-300 leading-relaxed">
              After account deletion, you can create a new account using the same Google account.
              However, your previous watch history, preferences, and subscription will not be restored.
              You will need to purchase a new subscription.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-zinc-300 leading-relaxed">
              For assistance with account deletion:{" "}
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
          <Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link>
          <Link href="/delete-account" className="text-accent">Delete Account</Link>
        </div>
      </footer>
    </div>
  );
}
