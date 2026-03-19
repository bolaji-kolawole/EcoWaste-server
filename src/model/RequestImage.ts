import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface RequestImageAttributes extends ModelAttributes {
  wasteRequestId: string;
  images: any;
  externalId: string;
}

interface RequestImageInput extends ModelInput {}

export class RequestImage extends Model<RequestImageAttributes, RequestImageInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public wasteRequestId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public images!: any;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class RequestImageRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({
    table: "waste_requests",
    column: "external_id",
    message: "Waste request does not exist"
  })
  wasteRequestId?: string;

  @Required()
  images?: any;

  @Required()
  externalId?: string;
}

RequestImage.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  wasteRequestId: { type: DataTypes.STRING, allowNull: false },
  images: { type: DataTypes.JSON, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "request_images",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});

export default RequestImage;