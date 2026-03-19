import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnUnique, ColumnExists } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import { Status } from "../constant/Status";

export interface RecyclingCompanyAttributes extends ModelAttributes {
  name: string;
  email: string;
  phone: string;
  address: string;
  clusterId: string;
  externalId: string;
  status: string;
}

interface RecyclingCompanyInput extends ModelInput {}

export class RecyclingCompany extends Model<RecyclingCompanyAttributes, RecyclingCompanyInput> {

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public name!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public email!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public phone!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public address!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public clusterId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public status!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public externalId!: string;
}

export class RecyclingCompanyRequest extends BarmouryRequest {
  @Required()
  name?: string;

  @Required()
  @ColumnUnique({ table: "recycling_companies", column: "email", message: "Email must be unique" })
  email?: string;

  @Required()
  @ColumnExists({ table: "street_clusters", column: "external_id", message: "Cluster does not exist" })
  clusterId?: string;

  phone?: string;
  address?: string;

  @Required()
  externalId?: string;
}

RecyclingCompany.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: true },
  clusterId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: Status.PENDING_APPROVAL },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "recycling_companies",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});


export default RecyclingCompany;