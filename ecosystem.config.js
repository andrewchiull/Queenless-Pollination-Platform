module.exports = {
  apps: [
    {
      name: 'routing-backend',
      script: 'cd routing/backend && fastapi dev --port 5001',
      watch: true,
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
  ],
};
