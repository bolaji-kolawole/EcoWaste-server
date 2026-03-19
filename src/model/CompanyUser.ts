import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists, ColumnUnique } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import { Status } from "../constant/Status";
export interface CompanyUserAttributes extends ModelAttributes {
  companyId: string;
  userId: string;
  status: string;
  externalId: string;
}

interface CompanyUserInput extends ModelInput {}

export class CompanyUser extends Model<CompanyUserAttributes, CompanyUserInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public companyId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public userId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public status!: string;
  public externalId!: string;
}

export class CompanyUserRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({
    table: "recycling_companies",
    column: "external_id",
    message: "Company does not exist"
  })
  companyId?: string;

  @Required()
  @ColumnExists({
    table: "users",
    column: "external_id",
    message: "User does not exist"
  })
  userId?: string;

}

CompanyUser.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  companyId: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: Status.ACTIVE },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "company_users",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});


export default CompanyUser;