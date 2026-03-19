import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface PickupScheduleAttributes extends ModelAttributes {
  collectorId: string;
  scheduledDate: Date;
  status: string;
  externalId: string;
}

interface PickupScheduleInput extends ModelInput {}

export class PickupSchedule extends Model<PickupScheduleAttributes, PickupScheduleInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public collectorId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public scheduledDate!: Date;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public status!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class PickupScheduleRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({ table: "collectors", column: "external_id", message: "Collector does not exist" })
  collectorId?: string;

  @Required()
  scheduledDate?: Date;

  status?: string;

  @Required()
  externalId?: string;
}

PickupSchedule.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  collectorId: { type: DataTypes.STRING, allowNull: false },
  scheduledDate: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "scheduled" },
  externalId: { type: DataTypes.STRING, allowNull: false},
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "pickup_schedules",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default PickupSchedule;