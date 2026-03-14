import { prisma } from "@/lib/prisma";

async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });
  } catch {
    return [];
  }
}

const statusColors: Record<string, string> = {
  ACTIVE: "text-green-400 bg-green-400/10",
  TRIAL: "text-blue-400 bg-blue-400/10",
  PAST_DUE: "text-yellow-400 bg-yellow-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  EXPIRED: "text-zinc-400 bg-zinc-400/10",
};

export default async function AdminUsers() {
  const users = await getUsers();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">
        Users ({users.length})
      </h1>

      {users.length === 0 ? (
        <div className="bg-[#121216] rounded-xl border border-white/5 p-12 text-center">
          <p className="text-zinc-500">No users yet.</p>
        </div>
      ) : (
        <div className="bg-[#121216] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-white/5">
                <th className="p-4 font-medium">User ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Subscription</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const subStatus =
                  user.subscriptions[0]?.status || "Free";
                return (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="p-4 text-sm text-[#f97316] font-mono">
                      {user.uniqueId}
                    </td>
                    <td className="p-4 text-sm text-white">
                      {user.displayName || "—"}
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{user.email}</td>
                    <td className="p-4 text-sm">
                      {user.role === "ADMIN" ? (
                        <span className="text-[#f97316] font-medium">
                          Admin
                        </span>
                      ) : (
                        <span className="text-zinc-500">User</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[subStatus] ||
                          "text-zinc-500 bg-zinc-500/10"
                        }`}
                      >
                        {subStatus}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
