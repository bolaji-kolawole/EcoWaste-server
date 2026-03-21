import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required, ColumnExists } from "barmoury/validation";

export interface PublicReportAttributes extends ModelAttributes {
  location: string;
  description: string;
  images: string;
  externalId: string;
}

interface PublicReportInput extends ModelInput { }

export class PublicReport extends Model<PublicReportAttributes, PublicReportInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public location!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public description!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.OBJECT_LIKE })
  public images!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class PublicReportRequest extends BarmouryRequest {
  @Required() location?: string;

  @Required() description?: string;

  @Required() images?: string;

  @Required() externalId?: string;
}

PublicReport.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  location: { type: DataTypes.STRING, allowNull: false },
  images: { type: DataTypes.JSON, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "public_reports",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default PublicReport;