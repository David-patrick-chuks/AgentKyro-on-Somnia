// Import all API clients
import { UserApiClient } from './userApi';
import { ContactApiClient } from './contactApi';
import { TeamApiClient } from './teamApi';
import { AnalyticsApiClient } from './analyticsApi';
import { TransactionApiClient } from './transactionApi';
import { SecurityApiClient } from './securityApi';
import { SharingApiClient } from './sharingApi';
import { NotificationApiClient } from './notificationApi';
import { HealthApiClient } from './healthApi';

// Export all API clients
export { UserApiClient } from './userApi';
export { ContactApiClient } from './contactApi';
export { TeamApiClient } from './teamApi';
export { AnalyticsApiClient } from './analyticsApi';
export { TransactionApiClient } from './transactionApi';
export { SecurityApiClient } from './securityApi';
export { SharingApiClient } from './sharingApi';
export { NotificationApiClient } from './notificationApi';
export { HealthApiClient } from './healthApi';

// Export types
export * from '@/types/api';

// Main API client that combines all modules
export class AgentKyroApiClient {
  static user = UserApiClient;
  static contacts = ContactApiClient;
  static teams = TeamApiClient;
  static analytics = AnalyticsApiClient;
  static transactions = TransactionApiClient;
  static security = SecurityApiClient;
  static sharing = SharingApiClient;
  static notifications = NotificationApiClient;
  static health = HealthApiClient;
}
