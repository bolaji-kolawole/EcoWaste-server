import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists, ColumnUnique } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface ClusterRequestAttributes extends ModelAttributes {
  clusterId: string;
  wasteRequestId: string;
  externalId: string;
}

interface ClusterRequestInput extends ModelInput {}

export class ClusterRequest extends Model<ClusterRequestAttributes, ClusterRequestInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public clusterId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public wasteRequestId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

// Validation class for Barmoury
export class ClusterRequestRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({
    table: "street_clusters",
    column: "external_id",
    message: "Cluster does not exist"
  })
  clusterId?: string;

  @Required()
  @ColumnExists({
    table: "waste_requests",
    column: "external_id",
    message: "Waste request does not exist"
  })
  wasteRequestId?: string;

  @Required() externalId?: string;
}

// Sequelize model definition
ClusterRequest.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  clusterId: { type: DataTypes.STRING, allowNull: false },
  wasteRequestId: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "cluster_requests",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});


export default ClusterRequest;