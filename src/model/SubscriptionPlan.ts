import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnUnique } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface SubscriptionPlanAttributes extends ModelAttributes {
  name: string;
  price: number;
  durationDays: number;
  externalId: string;
}

interface SubscriptionPlanInput extends ModelInput {}

export class SubscriptionPlan extends Model<SubscriptionPlanAttributes, SubscriptionPlanInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public name!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public price!: number;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public durationDays!: number;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class SubscriptionPlanRequest extends BarmouryRequest {
  @Required()
  name?: string;

  @Required()
  price?: number;

  @Required()
  durationDays?: number;
}

SubscriptionPlan.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  durationDays: { type: DataTypes.INTEGER, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "subscription_plans",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default SubscriptionPlan;