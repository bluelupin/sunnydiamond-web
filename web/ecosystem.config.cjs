module.exports = {
  apps: [{
    name: 'sunnydiamond-web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    // Without this pm2 writes bare lines, so an error in the log cannot be tied
    // to the moment a customer hit it, or to anything in the nginx/CDN logs.
    time: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
  }],
};
