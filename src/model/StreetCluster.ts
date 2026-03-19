import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface StreetClusterAttributes extends ModelAttributes {
  area: string;
  lga: string;
  externalId: string;
  extraData: string;
}

interface StreetClusterInput extends ModelInput {}

export class StreetCluster extends Model<StreetClusterAttributes, StreetClusterInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public area!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public lga!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public extraData!: string;
  
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public externalId!: string;
}

export class StreetClusterRequest extends BarmouryRequest {
  @Required()
  street?: string;

  @Required()
  lga?: string;

  @Required()
  externalId?: string;
}

StreetCluster.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  area: { type: DataTypes.STRING, allowNull: false },
  lga: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  extraData: { type: DataTypes.JSON, allowNull: true },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "street_clusters",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default StreetCluster;