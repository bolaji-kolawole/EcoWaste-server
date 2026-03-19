import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import WasteRequest from "./WasteRequest";
import Collector from "./Collector";

export interface RequestAssignmentAttributes extends ModelAttributes {
  wasteRequestId: string;
  collectorId: string;
  status: string;
  externalId: string;
}

interface RequestAssignmentInput extends ModelInput {}

export class RequestAssignment extends Model<RequestAssignmentAttributes, RequestAssignmentInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public wasteRequestId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public collectorId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public status!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class RequestAssignmentRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({
    table: "waste_requests",
    column: "external_id",
    message: "Waste request does not exist"
  })
  wasteRequestId?: string;

  @Required()
  @ColumnExists({
    table: "collectors",
    column: "external_id",
    message: "Collector does not exist"
  })
  collectorId?: string;

  status?: string;

  @Required()
  externalId?: string;
}

RequestAssignment.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  wasteRequestId: { type: DataTypes.STRING, allowNull: false },
  collectorId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "assigned" },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "request_assignments",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default RequestAssignment;