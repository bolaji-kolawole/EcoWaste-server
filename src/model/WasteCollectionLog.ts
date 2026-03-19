import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required } from "barmoury/validation";
import WasteRequest from "./WasteRequest";
import Collector from "./Collector";

export interface WasteCollectionLogAttributes extends ModelAttributes {
  wasteRequestId: string;
  collectorId: string;
  status: string;
  collectedAt?: Date;
  externalId: string;
}

interface WasteCollectionLogInput extends ModelInput {}

export class WasteCollectionLog extends Model<WasteCollectionLogAttributes, WasteCollectionLogInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public wasteRequestId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public collectorId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public status!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public collectedAt?: Date;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class WasteCollectionLogRequest extends BarmouryRequest {
  @Required()
  wasteRequestId?: string;

  @Required()
  collectorId?: string;

  @Required()
  status?: string;

  collectedAt?: Date;

  @Required()
  externalId?: string;
}

WasteCollectionLog.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  wasteRequestId: { type: DataTypes.STRING, allowNull: false },
  collectorId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  collectedAt: { type: DataTypes.DATE, allowNull: true },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "waste_collection_logs",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default WasteCollectionLog;