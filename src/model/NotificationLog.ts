import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import Notification from "./Notification";
import User from "./User";
import { ColumnExists, Required } from "barmoury/validation";

export interface NotificationLogAttributes extends ModelAttributes {
  notificationId: string;
  userId: string;
  deliveryStatus: string;
  deliveredAt?: Date;
  externalId: string;
}

interface NotificationLogInput extends ModelInput {}

export class NotificationLog extends Model<NotificationLogAttributes, NotificationLogInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public notificationId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public userId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public deliveryStatus!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public deliveredAt?: Date;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class NotificationLogRequest extends BarmouryRequest {
  
  @Required()
  @ColumnExists({
    table: "notifications",
    column: "external_id",
    message: "Notification does not exist"
  })
  notificationId!: string;

  @Required()
  @ColumnExists({
    table: "users",
    column: "external_id",
    message: "User does not exist"
  })
  userId!: string;

  @Required()
  deliveryStatus!: string;

  deliveredAt?: Date;
}


NotificationLog.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  notificationId: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false },
  deliveryStatus: { type: DataTypes.STRING, allowNull: false },
  deliveredAt: { type: DataTypes.DATE, allowNull: true },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "notification_logs",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default NotificationLog;