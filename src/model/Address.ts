import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { ColumnExists, Required, ColumnUnique } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface AddressAttributes extends ModelAttributes {
  userId: string;
  street: string;
  city?: string;
  clusterId: string;
  state?: string;
  postalCode?: string;
  latitude: string;
  longitude: string;
  externalId: string;
}

interface AddressInput extends ModelInput {}

export class Address extends Model<AddressAttributes, AddressInput> {

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public userId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public street!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public clusterId?: string;
  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE }) public city?: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public state?: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public postalCode?: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public latitude!: string;
  public longitude!: string;
  public externalId!: string;
}

// Barmoury Request for validation
export class AddressRequest extends BarmouryRequest {

  @Required()
  @ColumnExists({
    table: "users",
    column: "external_id",
    message: "The user does not exist in the system"
  })
  userId?: string;

  @Required() street?: string;
  @Required() city?: string;
  @Required() state?: string;
  postalCode?: string;
  @Required() externalId?: string;
}

// Sequelize model definition
Address.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clusterId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  externalId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: "addresses",
  sequelize: database.sequelizeConnection,
});

export default Address;
