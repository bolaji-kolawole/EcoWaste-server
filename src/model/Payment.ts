import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { ColumnExists, Required, ColumnUnique } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import { Currency, PaymentStatus } from "../constant/Status";

export interface PaymentAttributes extends ModelAttributes {
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  reference: string;
  extraData: any;
  subscriptionId: string;
  userSubscriptionId: string;
  externalId: string;
}

interface PaymentInput extends ModelInput {}

export class Payment extends Model<PaymentAttributes, PaymentInput> {

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public userId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public amount!: number;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public currency?: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public paymentMethod!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public status!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public subscriptionId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public userSubscriptionId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public reference!: string;
  public extraData!: any;
  public externalId!: string;
}


// Barmoury Request for validation
export class PaymentRequest extends BarmouryRequest {

  @Required()
  @ColumnExists({
    table: "users",
    column: "external_id",
    message: "The user does not exist in the system"
  })
  userId?: string;

  @Required()
  @ColumnExists({
    table: "subscription_plans",
    column: "external_id",
    message: "The subscription does not exist in the system"
  })
  subscriptionId?: string;

  @Required()
  @ColumnExists({
    table: "user_subscriptions",
    column: "external_id",
    message: "The user subscription does not exist in the system"
  })
  userSubscriptionId?: string;

  @Required()
  amount?: number;

  @Required()
  paymentMethod?: string;

  @Required()
  reference?: string;
}


// Sequelize model definition
Payment.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: Currency.NGN,
  },

  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  subscriptionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },


  userSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: PaymentStatus.PENDING,
  },

  extraData: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  reference: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  externalId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  timestamps: true,
  underscored: true,
  tableName: "payments",
  sequelize: database.sequelizeConnection,
});

export default Payment;