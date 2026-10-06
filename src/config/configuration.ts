const parseBool = (val: string | undefined, defaultVal = true): boolean => {
  if (val === undefined || val === '') return defaultVal;
  return val === 'true' || val === '1';
};

export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ecommerce_boilerplate_jwt_secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
  },
  features: {
    blog: parseBool(process.env.FEATURE_BLOG, true),
    wallet: parseBool(process.env.FEATURE_WALLET, true),
    referral: parseBool(process.env.FEATURE_REFERRAL, true),
    coupons: parseBool(process.env.FEATURE_COUPONS, true),
    attributes: parseBool(process.env.FEATURE_ATTRIBUTES, true),
    flashDeals: parseBool(process.env.FEATURE_FLASH_DEALS, true),
    notifications: parseBool(process.env.FEATURE_NOTIFICATIONS, true),
  },
});

