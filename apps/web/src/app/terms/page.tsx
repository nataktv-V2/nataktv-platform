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
              Terms and Conditions for Natak TV outline the rules and regulations for the use of Natak TV&apos;s
              website and services. By accessing this website, users accept these terms and conditions in full
              and should discontinue use if they do not agree with all terms stated. Throughout these Terms and
              Conditions, Privacy Statement, Disclaimer Notice, and all Agreements, references such as
              &quot;Client,&quot; &quot;You,&quot; and &quot;Your&quot; refer to the user, while &quot;The
              Company,&quot; &quot;We,&quot; &quot;Our,&quot; and &quot;Us&quot; refer to Natak TV, operated by
              INDIDINO VENTURES PRIVATE LIMITED. All terms relate to the offer, acceptance, and consideration
              of payment necessary to provide Natak TV&apos;s services in accordance with applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Intellectual Property & Content Usage</h2>
            <p className="text-zinc-300 leading-relaxed">
              Unless otherwise stated, Natak TV and/or its licensors own the intellectual property rights for
              all material on the platform, and all such rights are reserved. Users may access content for
              personal use only and must not republish, sell, rent, sublicense, reproduce, duplicate, copy,
              or redistribute material from Natak TV. Certain areas of the website allow users to post and
              exchange opinions or information; Natak TV does not pre-screen comments and is not responsible
              for their content, which reflects the views of the individual users. Natak TV reserves the right
              to monitor and remove comments that are inappropriate, offensive, or violate these terms. Users
              warrant that their comments do not infringe intellectual property rights, are not defamatory,
              unlawful, or invasive of privacy, and are not used for commercial solicitation. By posting
              comments, users grant Natak TV a non-exclusive license to use, reproduce, edit, and authorize
              others to use such content in any form or media.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Subscription & Payments</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Natak TV offers a subscription plan at ₹199/month with a ₹2 trial for 2 days.</li>
              <li>Payments are processed securely through Razorpay.</li>
              <li>Subscriptions auto-renew monthly unless cancelled.</li>
              <li>You can cancel your subscription anytime from your profile page.</li>
              <li>Upon cancellation, you retain access until the end of your current billing period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Linking & Framing</h2>
            <p className="text-zinc-300 leading-relaxed">
              Certain organizations, including government agencies, search engines, news organizations, and
              online directory distributors, may link to Natak TV&apos;s website without prior written approval,
              provided the link is not deceptive, does not imply sponsorship or endorsement, and fits the
              context of the linking site. Other organizations may request approval to link, and Natak TV may
              approve such requests at its discretion based on reputation, benefit, and relevance. Approved
              organizations may link using Natak TV&apos;s corporate name, URL, or appropriate descriptive text.
              The use of Natak TV&apos;s logo or artwork for linking purposes is prohibited without a trademark
              license agreement. Framing of Natak TV&apos;s webpages without prior approval is not permitted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Disclaimer & Liability</h2>
            <p className="text-zinc-300 leading-relaxed">
              Natak TV is not responsible for content appearing on external websites that link to it and
              reserves the right to request removal of any links at any time. Natak TV may amend these terms
              and linking policies without notice, and continued linking implies acceptance of updated terms.
              If any link on the website is found offensive, users may request its removal, though Natak TV
              is not obligated to act or respond directly. Natak TV does not guarantee the accuracy,
              completeness, availability, or timeliness of the information on the website.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              To the maximum extent permitted by law, Natak TV excludes all representations, warranties, and
              conditions related to the website and its use, except where liability cannot be excluded, such
              as for death, personal injury, fraud, or statutory obligations. Natak TV shall not be liable
              for any loss or damage of any nature as long as the website and services are provided free of
              charge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Account & Authentication</h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>You must sign in using Google Sign-In to access the platform.</li>
              <li>You are responsible for maintaining the security of your Google account.</li>
              <li>One account per person. Account sharing is not permitted.</li>
              <li>You must be at least 13 years old to use Natak TV.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Child Safety</h2>
            <p className="text-zinc-300 leading-relaxed">
              Natak TV is committed to maintaining the highest standards of child safety and protection in
              compliance with Google Play&apos;s Families Policy and applicable child protection laws. The
              application does not knowingly collect, use, or share personal information from children under
              the age of 13 (or the applicable age of digital consent) without verified parental consent. The
              app does not contain content that sexualizes minors, facilitates inappropriate interaction with
              children, or includes material that could endanger child safety. User-generated content violating
              child safety standards is prohibited, reporting mechanisms are maintained for concerning behavior,
              and parents or guardians may request review or deletion of a child&apos;s information by contacting
              the support email provided. Natak TV regularly reviews its practices to ensure compliance and
              reserves the right to suspend or terminate accounts that violate child protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
            <p className="text-zinc-300 leading-relaxed">
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
              jurisdiction of courts in Bengaluru, Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
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
