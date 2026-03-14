import { prisma } from "@/lib/prisma";

async function getDashboardStats() {
  try {
    const [totalUsers, totalVideos, totalSubscriptions, activeSubscriptions] =
      await Promise.all([
        prisma.user.count(),
        prisma.video.count(),
        prisma.subscription.count(),
        prisma.subscription.count({
          where: { status: { in: ["ACTIVE", "TRIAL"] } },
        }),
      ]);

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        uniqueId: true,
        displayName: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      totalUsers,
      totalVideos,
      totalSubscriptions,
      activeSubscriptions,
      recentUsers,
    };
  } catch {
    return {
      totalUsers: 0,
      totalVideos: 0,
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      recentUsers: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👤",
    },
    {
      label: "Total Videos",
      value: stats.totalVideos,
      icon: "🎬",
    },
    {
      label: "Active Subscribers",
      value: stats.activeSubscriptions,
      icon: "⭐",
    },
    {
      label: "Total Subscriptions",
      value: stats.totalSubscriptions,
      icon: "💳",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#121216] rounded-xl border border-white/5 p-4"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-[#121216] rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Users</h2>
        {stats.recentUsers.length === 0 ? (
          <p className="text-zinc-500">No users yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-white/5">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="py-3 text-sm text-[#f97316] font-mono">
                    {user.uniqueId}
                  </td>
                  <td className="py-3 text-sm text-white">
                    {user.displayName || "—"}
                  </td>
                  <td className="py-3 text-sm text-zinc-400">{user.email}</td>
                  <td className="py-3 text-sm text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
