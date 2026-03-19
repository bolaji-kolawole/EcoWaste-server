import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import { WasteRequestStatus } from "../constant/Status";

export interface RequestStatusAttributes extends ModelAttributes {
  wasteRequestId: string;
  status: string;
  acceptedAt: Date;
  assignedAt: Date;
  completedAt: Date;
  cancelledAt: Date;
  externalId: string;
}

interface RequestStatusInput extends ModelInput {}

export class RequestStatus extends Model<RequestStatusAttributes, RequestStatusInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public wasteRequestId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public status!: string;
  public acceptedAt!: Date;
  public assignedAt!: Date;
  public completedAt!: Date;
  public cancelledAt!: Date;
  public externalId!: string;
}

export class RequestStatusRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({
    table: "waste_requests",
    column: "external_id",
    message: "Waste request does not exist"
  })
  wasteRequestId?: string;

  @Required() status?: string;
  @Required() externalId?: string;
}

RequestStatus.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  wasteRequestId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: WasteRequestStatus.PENDING },
  acceptedAt: { type: DataTypes.DATE, allowNull: true },
  assignedAt: { type: DataTypes.DATE, allowNull: true },
  completedAt: { type: DataTypes.DATE, allowNull: true },
  cancelledAt: { type: DataTypes.DATE, allowNull: true },
  externalId: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "request_status",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default RequestStatus;