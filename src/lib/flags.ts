import { ConfigurationService } from './configuration';

export const isLmsEnabled = (): boolean => {
  return ConfigurationService.isFeatureEnabled('lms');
};

export const isDevelopment = (): boolean => {
  return ConfigurationService.getNextJSConfig().isDevelopment;
};
