export const isLmsEnabled = (): boolean => {
  // For now, always enabled. In production, this could check:
  // - Environment variables
  // - Feature flags from database
  // - User permissions
  return process.env.NODE_ENV === 'development' || process.env.ENABLE_LMS === 'true' || true;
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
