"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Payment {
  id: string;
  razorpayPaymentId: string;
  amountPaise: number;
  currency: string;
  status: string;
  paidAt: string;
  subscription: {
    status: string;
    razorpaySubscriptionId: string | null;
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(paise: number, currency: string): string {
  const rupees = paise / 100;
  if (currency === "INR") {
    return `\u20B9${rupees.toFixed(2)}`;
  }
  return `${rupees.toFixed(2)} ${currency}`;
}

function statusStyle(status: string): string {
  const s = status.toLowerCase();
  if (s === "captured" || s === "success" || s === "paid") {
    return "bg-green-500/20 text-green-400";
  }
  if (s === "pending" || s === "created" || s === "authorized") {
    return "bg-yellow-500/20 text-yellow-400";
  }
  if (s === "failed" || s === "refunded" || s === "expired") {
    return "bg-red-500/20 text-red-400";
  }
  return "bg-zinc-500/20 text-zinc-400";
}

function truncateId(id: string): string {
  if (id.length <= 16) return id;
  return id.slice(0, 12) + "..." + id.slice(-4);
}

export default function PaymentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchPayments() {
      try {
        const res = await fetch(
          `/api/subscription/history?uid=${encodeURIComponent(user!.uid)}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch payments");
        }
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-zinc-400 mb-4">Please sign in to view payment history.</p>
        <Link
          href="/profile"
          className="text-[#f97316] font-medium hover:underline"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

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
        <h1 className="text-xl font-bold">Payment History</h1>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#121216] border border-white/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-7 h-7 text-zinc-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          </div>
          <p className="text-zinc-400 text-sm mb-1">No payments yet</p>
          <p className="text-zinc-600 text-xs">
            Your payment history will appear here after you subscribe.
          </p>
        </div>
      )}

      {/* Payment Cards */}
      {payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-[#121216] border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-base">
                  {formatAmount(payment.amountPaise, payment.currency)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyle(payment.status)}`}
                >
                  {payment.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">
                  {formatDate(payment.paidAt)}
                </span>
                <span className="text-zinc-500 text-xs font-mono">
                  {truncateId(payment.razorpayPaymentId)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
