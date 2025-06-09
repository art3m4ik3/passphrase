module.exports = {
  apps: [
    {
      name: "passphrase",
      script: "bun",
      args: "run start",
      cwd: "/home/passphrase",
      interpreter: "none",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
