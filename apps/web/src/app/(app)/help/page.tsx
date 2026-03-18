"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useState } from "react";

export default function HelpSupportPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailtoBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:officialnataktv@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
    window.location.href = mailtoLink;

    setSubmitted(true);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-bold">Help & Support</h1>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-green-400"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Message Sent!</h2>
          <p className="text-zinc-400 text-sm mb-1">
            Your email app should have opened with the message.
          </p>
          <p className="text-zinc-500 text-xs mb-6">
            If it didn&apos;t open, you can email us directly at{" "}
            <a
              href="mailto:officialnataktv@gmail.com"
              className="text-[#f97316] hover:underline"
            >
              officialnataktv@gmail.com
            </a>
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSubject("");
              setMessage("");
            }}
            className="text-[#f97316] text-sm font-medium hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <p className="text-zinc-400 text-sm mb-6">
            Have a question or facing an issue? Fill out the form below and we&apos;ll
            get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="help-name"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Name
              </label>
              <input
                id="help-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#f97316]/50 focus:ring-1 focus:ring-[#f97316]/30 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="help-email"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="help-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#f97316]/50 focus:ring-1 focus:ring-[#f97316]/30 transition-colors"
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="help-subject"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Subject
              </label>
              <input
                id="help-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#f97316]/50 focus:ring-1 focus:ring-[#f97316]/30 transition-colors"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="help-message"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="help-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#f97316]/50 focus:ring-1 focus:ring-[#f97316]/30 transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Direct email fallback */}
          <p className="text-zinc-500 text-xs text-center mt-6">
            Or email us directly at{" "}
            <a
              href="mailto:officialnataktv@gmail.com"
              className="text-[#f97316] hover:underline"
            >
              officialnataktv@gmail.com
            </a>
          </p>
        </>
      )}
    </div>
  );
}
