import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import { Status, WasteRequestStatus } from "../constant/Status";

export interface WasteRequestAttributes extends ModelAttributes {
  userId: string;
  wasteTypeId: string;
  recyclingCompanyId: string;
  addressId: string;
  description: string;
  extraData: string;
  scheduledDate?: Date;
  quantity: string;
  externalId: string;
}

interface WasteRequestInput extends ModelInput {}

export class WasteRequest extends Model<WasteRequestAttributes, WasteRequestInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public userId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public wasteTypeId!: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public recyclingCompanyId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public addressId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public scheduledDate?: Date;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public quantity!: string;
  public description!: string;
  public extraData!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class WasteRequestRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({ table: "users", column: "external_id", message: "User does not exist" })
  userId?: string;

  @Required()
  @ColumnExists({ table: "waste_types", column: "external_id", message: "Waste type does not exist" })
  wasteTypeId?: string;

  @Required()
  @ColumnExists({ table: "addresses", column: "external_id", message: "Address does not exist" })
  addressId?: string;

  @Required() quantity!: string;
  @Required() description!: string;
  

}

WasteRequest.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  wasteTypeId: { type: DataTypes.STRING, allowNull: false },
  recyclingCompanyId: { type: DataTypes.STRING, allowNull: true },
  addressId: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  extraData: { type: DataTypes.STRING, allowNull: true },
  scheduledDate: { type: DataTypes.DATE, allowNull: true },
  quantity: { type: DataTypes.STRING, allowNull: true },
  externalId: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "waste_requests",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default WasteRequest;