import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required } from "barmoury/validation";

export interface ApiKeyAttributes extends ModelAttributes {
  key: string;
  owner: string;
  permissions: string;
  externalId: string;
}

interface ApiKeyInput extends ModelInput {}

export class ApiKey extends Model<ApiKeyAttributes, ApiKeyInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public key!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public owner!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.OBJECT_LIKE }) public permissions!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public externalId!: string;
}

export class ApiKeyRequest extends BarmouryRequest {
  @Required() key?: string;
  @Required() owner?: string;
  @Required() permissions?: string;
  @Required() externalId?: string;
}

ApiKey.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  key: { type: DataTypes.STRING, allowNull: false },
  owner: { type: DataTypes.STRING, allowNull: false },
  permissions: { type: DataTypes.JSON, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "api_keys",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default ApiKey;