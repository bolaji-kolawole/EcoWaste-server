import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnUnique } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface WasteTypeAttributes extends ModelAttributes {
  name: string;
  externalId: string;
}

interface WasteTypeInput extends ModelInput {}

export class WasteType extends Model<WasteTypeAttributes, WasteTypeInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public name!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class WasteTypeRequest extends BarmouryRequest {
  @Required()
  name?: string;
  
}

WasteType.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false},
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "waste_types",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default WasteType;