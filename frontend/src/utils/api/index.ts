// Import all API clients
import { AnalyticsApiClient } from './analyticsApi';
import { ChatApiClient } from './chatApi';
import { ContactApiClient } from './contactApi';
import { HealthApiClient } from './healthApi';
import { NotificationApiClient } from './notificationApi';
import { SecurityApiClient } from './securityApi';
import { SharingApiClient } from './sharingApi';
import { TeamApiClient } from './teamApi';
import { TransactionApiClient } from './transactionApi';
import { UserApiClient } from './userApi';

// Export all API clients
export { AnalyticsApiClient } from './analyticsApi';
export { ChatApiClient } from './chatApi';
export { ContactApiClient } from './contactApi';
export { HealthApiClient } from './healthApi';
export { NotificationApiClient } from './notificationApi';
export { SecurityApiClient } from './securityApi';
export { SharingApiClient } from './sharingApi';
export { TeamApiClient } from './teamApi';
export { TransactionApiClient } from './transactionApi';
export { UserApiClient } from './userApi';

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
  static chat = ChatApiClient;
  static health = HealthApiClient;
}
