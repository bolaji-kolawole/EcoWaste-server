import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists, ColumnUnique } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface CollectorAttributes extends ModelAttributes {
  companyId: string;
  name: string;
  phone?: string;
  externalId: string;
}

interface CollectorInput extends ModelInput {}

export class Collector extends Model<CollectorAttributes, CollectorInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public companyId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public name!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public phone?: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class CollectorRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({
    table: "recycling_companies",
    column: "external_id",
    message: "Company does not exist"
  })
  companyId?: string;

  @Required()
  name?: string;

  phone?: string;
  externalId?: string;
}

Collector.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  companyId: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "collectors",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default Collector;