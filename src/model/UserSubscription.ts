import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { ColumnExists, Required } from "barmoury/validation";
import { PaymentStatus } from "../constant/Status";
import { RequestParamFilter } from "barmoury/eloquent";

export interface UserSubscriptionAttributes extends ModelAttributes {
  userId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
  externalId: string;
}

interface UserSubscriptionInput extends ModelInput {}

export class UserSubscription extends Model<UserSubscriptionAttributes, UserSubscriptionInput> {
  // Optional: Type-safe accessors for fields
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public userId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public planId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public status!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public startDate!: Date;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public endDate!: Date;
  public externalId!: string;

  // Optional: Helper method to check if subscription is active
  public isActive(): boolean {
    const now = new Date();
    return now >= new Date(this.startDate) && now <= new Date(this.endDate) && this.status === "active";
  }

  // Optional: Helper to update status
  public activate() {
    this.status = "active";
    return this.save();
  }

  public cancel() {
    this.status = "cancelled";
    return this.save();
  }
}

export class UserSubscriptionRequest extends BarmouryRequest {

  @Required()
  @ColumnExists({
    table: "users",
    column: "external_id",
    message: "User does not exist"
  })
  userId!: string;

  @Required()
  @ColumnExists({
    table: "subscription_plans",
    column: "external_id",
    message: "Subscription plan does not exist"
  })
  planId!: string;

  @Required()
  startDate!: Date;

  @Required()
  endDate!: Date;
}

UserSubscription.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  planId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: PaymentStatus.SUCCESSFUL },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "user_subscriptions",
  timestamps: true,
  underscored: true,
  sequelize: database.sequelizeConnection
});


export default UserSubscription;
