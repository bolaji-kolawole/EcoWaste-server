import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required } from "barmoury/validation";

export interface GovernmentAgencyAttributes extends ModelAttributes {
  name: string;
  externalId: string;
}

interface GovernmentAgencyInput extends ModelInput {}

export class GovernmentAgency extends Model<GovernmentAgencyAttributes, GovernmentAgencyInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public name!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public externalId!: string;
}

export class GovernmentAgencyRequest extends BarmouryRequest {
  @Required() name?: string;
  @Required() externalId?: string;
}

GovernmentAgency.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "government_agencies",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default GovernmentAgency;