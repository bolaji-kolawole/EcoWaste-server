import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required, ColumnUnique } from "barmoury/validation";

export interface NotificationAttributes extends ModelAttributes {
  title: string;
  message: string;
  type: string;
  recipientId: string;
  recipientRole: string;
  read: boolean;
  externalId: string;
}

interface NotificationInput extends ModelInput {}

export class Notification extends Model<NotificationAttributes, NotificationInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public title!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public message!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public type!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public recipientRole!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public recipientId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public read!: string;
  public externalId!: string;
}

export class NotificationRequest extends BarmouryRequest {
  @Required() title?: string;
  @Required() message?: string;
  @Required() type?: string;
  @Required() recipientRole?: string;
  @Required()
  @ColumnUnique({ table: "notifications", column: "external_id", message: "External ID must be unique" })
  externalId?: string;
}

Notification.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  recipientRole: { type: DataTypes.STRING, allowNull: false },
  recipientId: { type: DataTypes.STRING, allowNull: false },
  read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "notifications",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default Notification;