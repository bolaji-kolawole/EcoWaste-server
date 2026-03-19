import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required } from "barmoury/validation";
import User from "./User";
import RewardTransaction from "./RewardTransaction";

export interface RecyclingRewardAttributes extends ModelAttributes {
  userId: string;
  points: number;
  externalId: string;
}

interface RecyclingRewardInput extends ModelInput {}

export class RecyclingReward extends Model<RecyclingRewardAttributes, RecyclingRewardInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public userId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public points!: number;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class RecyclingRewardRequest extends BarmouryRequest {
  @Required()
  userId?: string;

  @Required()
  points?: number;

  @Required()
  externalId?: string;
}

RecyclingReward.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  points: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "recycling_rewards",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default RecyclingReward;