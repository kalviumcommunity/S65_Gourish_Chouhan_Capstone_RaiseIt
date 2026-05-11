const requiredProductionEnv = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];

function validateEnv() {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = requiredProductionEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }
}

module.exports = { validateEnv };
