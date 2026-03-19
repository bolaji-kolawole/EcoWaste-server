import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required } from "barmoury/validation";
import { RewardType } from "../constant/Status";

export interface RewardTransactionAttributes extends ModelAttributes {
  userId: string;
  points: number;
  type: string;
  externalId: string;
}

interface RewardTransactionInput extends ModelInput {}

export class RewardTransaction extends Model<RewardTransactionAttributes, RewardTransactionInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public userId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public points!: number;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public type!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class RewardTransactionRequest extends BarmouryRequest {
  @Required() userId?: string;
  @Required() points?: number;
  @Required() externalId?: string;
}

RewardTransaction.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  points: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: RewardType.EARNED },
  externalId: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "reward_transactions",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default RewardTransaction;