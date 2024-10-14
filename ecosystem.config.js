module.exports = {
  apps: [
    {
      name: 'shopping-backend',
      script: 'cd shopping/backend && yarn dev',
      watch: true,
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster', // Run in cluster mode
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
    },
    {
      name: 'shopping-frontend',
      script: 'cd shopping/frontend && yarn dev',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
    {
      name: 'database',
      script: 'cd db && docker compose up',
      watch: false,
    },
  ],
};
