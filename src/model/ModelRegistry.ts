import User, { UserRequest } from "./User";
import Role, { RoleRequest } from "./Role";
import Address, { AddressRequest } from "./Address";
import WasteType, { WasteTypeRequest } from "./WasteType";
import WasteRequest, { WasteRequestRequest } from "./WasteRequest";
import RecyclingCompany, { RecyclingCompanyRequest } from "./RecyclingCompany";
import SubscriptionPlan, { SubscriptionPlanRequest } from "./SubscriptionPlan";
import UserSubscription, { UserSubscriptionRequest } from "./UserSubscription";
import PickupSchedule, { PickupScheduleRequest } from "./PickupSchedule";
import Notification, { NotificationRequest } from "./Notification";
import UserRole, { UserRoleRequest } from "./UserRole";
import Payment, { PaymentRequest } from "./Payment";
import RequestImage, { RequestImageRequest } from "./RequestImage";
import RequestAssignment, { RequestAssignmentRequest } from "./RequestAssignment";
import CompanyUser, { CompanyUserRequest } from "./CompanyUser";
import WasteCollectionLog, { WasteCollectionLogRequest } from "./WasteCollectionLog";
import RecyclingReward, { RecyclingRewardRequest } from "./RecyclingReward";
import RewardTransaction, { RewardTransactionRequest} from "./RewardTransaction";
import StreetCluster, { StreetClusterRequest } from "./StreetCluster";
import NotificationLog, { NotificationLogRequest } from "./NotificationLog";
import Report, { ReportRequest } from "./Report";
import PublicReport, { PublicReportRequest } from "./PublicReport";

export const MODEL_REGISTRY: Record<string, any> = {
  users: {
    model: User,
    request: UserRequest,
    hashPassword: true,
    hiddenFields: ["password"]
  },

  company_users: {
    model: CompanyUser,
    request: CompanyUserRequest
  },

  waste_collection_logs: {
    model: WasteCollectionLog,
    request: WasteCollectionLogRequest
  },

  reward_transactions: {
    model: RewardTransaction,
    request: RewardTransactionRequest
  },

  street_clusters: {
    model: StreetCluster,
    request: StreetClusterRequest
  },

  notification_logs: {
    model: NotificationLog,
    request: NotificationLogRequest
  },

  recycling_rewards: {
    model: RecyclingReward,
    request: RecyclingRewardRequest
  },

  roles: {
    model: Role,
    request: RoleRequest
  },


  reports: {
    model: Report,
    request: ReportRequest
  },


  public_reports: {
    model: PublicReport,
    request: PublicReportRequest
  },

  user_roles: {
    model: UserRole,
    request: UserRoleRequest
  },

  addresses: {
    model: Address,
    request: AddressRequest
  },

  waste_types: {
    model: WasteType,
    request: WasteTypeRequest
  },

  waste_requests: {
    model: WasteRequest,
    request: WasteRequestRequest
  },

  recycling_companies: {
    model: RecyclingCompany,
    request: RecyclingCompanyRequest
  },

  subscription_plans: {
    model: SubscriptionPlan,
    request: SubscriptionPlanRequest
  },

  user_subscriptions: {
    model: UserSubscription,
    request: UserSubscriptionRequest
  },

  pickup_schedules: {
    model: PickupSchedule,
    request: PickupScheduleRequest
  },

  notifications: {
    model: Notification,
    request: NotificationRequest
  },

  payments: {
    model: Payment,
    request: PaymentRequest
  },

  request_images: {
    model: RequestImage,
    request: RequestImageRequest
  },

  request_assignments: {
    model: RequestAssignment,
    request: RequestAssignmentRequest
  }
};