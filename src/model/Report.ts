import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required, ColumnExists } from "barmoury/validation";
import User from "./User";

export interface ReportAttributes extends ModelAttributes {
  title: string;
  data: string;
  generatedBy: string;
  externalId: string;
}

interface ReportInput extends ModelInput {}

export class Report extends Model<ReportAttributes, ReportInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public title!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.OBJECT_LIKE })
  public data!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public generatedBy!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class ReportRequest extends BarmouryRequest {
  @Required()
  title?: string;

  @Required()
  data?: string;

  @Required()
  @ColumnExists({
    table: "users",
    column: "external_id",
    message: "User generating report does not exist"
  })
  generatedBy?: string;

  @Required()
  externalId?: string;
}

Report.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.JSON, allowNull: false },
  generatedBy: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "reports",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default Report;