module.exports = {
  apps: [
    {
      name: 'sunnydiamond-web',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      cwd: '/home/forge/sunnydiamond-web-dev.on-forge.com/current/web',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
