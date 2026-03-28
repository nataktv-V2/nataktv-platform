// PM2 Ecosystem Config — Natak TV
module.exports = {
  apps: [
    {
      name: "nataktv",
      cwd: "/opt/nataktv/apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/var/log/nataktv/error.log",
      out_file: "/var/log/nataktv/out.log",
      merge_logs: true,
    },
  ],
};
