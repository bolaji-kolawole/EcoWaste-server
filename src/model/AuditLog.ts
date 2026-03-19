import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required } from "barmoury/validation";

export interface AuditLogAttributes extends ModelAttributes {
  action: string;
  entity: string;
  entityId: string;
  performedBy: string;
  externalId: string;
}

interface AuditLogInput extends ModelInput {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public action!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public entity!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public entityId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public performedBy!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public externalId!: string;
}

export class AuditLogRequest extends BarmouryRequest {
  @Required() action?: string;
  @Required() entity?: string;
  @Required() entityId?: string;
  @Required() performedBy?: string;
  @Required() externalId?: string;
}

AuditLog.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  action: { type: DataTypes.STRING, allowNull: false },
  entity: { type: DataTypes.STRING, allowNull: false },
  entityId: { type: DataTypes.STRING, allowNull: false },
  performedBy: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "audit_logs",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default AuditLog;