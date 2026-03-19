import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { ColumnExists, ColumnUnique, Required } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import { Status } from "../constant/Status";

export interface UserAttributes extends ModelAttributes {
  firstName: string;
  lastName: string;
  email: string;
  profilePictureLocation: string;
  dob: string;
  gender: string;
  lasraId: string;
  password: string;
  phone: string;
  status: string;
  externalId: string;
  emailVerified: boolean;
}

interface UserInput extends ModelInput {}

export class User extends Model<UserAttributes, UserInput> {

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public firstName!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public lastName!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public email!: string;

  public password!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public status!: string;
  public phone!: string;
  public profilePictureLocation!: string;
  public dob!: string;
  public gender!: string;
  public lasraId!: string;
  public emailVerified!: boolean;

}

export class UserRequest extends BarmouryRequest {

  @Required()
  firstName?: string;

  @Required()
  lastName?: string;

  @Required()
  password?: string;

  @Required()
  @ColumnUnique({
    table: "users",
    column: "email",
    message: "Email already exist"
  })
  email?: string;

}

export class UserSignInRequest extends BarmouryRequest {

  @Required()
  @ColumnExists({
    table: "users",
    column: "email",
    message: "User with '{value}' doesn't exist"
  })
  email?: string;
  @Required()
  password?: string;
  @Required()
  roleId?: string;

}

export interface AuthResponse {
  accessToken?: string;
  sessionToken?: string;
  sessionExpiryInHours?: number;
}

User.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

  firstName: { type: DataTypes.STRING, allowNull: false },

  lastName: { type: DataTypes.STRING, allowNull: false },

  email: { type: DataTypes.STRING, allowNull: false },

  profilePictureLocation: { type: DataTypes.STRING, allowNull: true },

  dob: { type: DataTypes.STRING, allowNull: true },

  gender: { type: DataTypes.STRING, allowNull: true },

  lasraId: { type: DataTypes.STRING, allowNull: true },

  password: { type: DataTypes.STRING, allowNull: false },

  phone: { type: DataTypes.STRING, allowNull: true },

  status: { type: DataTypes.STRING, allowNull: false, defaultValue: Status.ACTIVE },

  externalId: { type: DataTypes.STRING, allowNull: false },

  emailVerified: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },

  createdAt: { type: DataTypes.DATE, allowNull: false },

  updatedAt: { type: DataTypes.DATE, allowNull: false }

}, {
  tableName: "users",
  timestamps: true,
  underscored: true,
  sequelize: database.sequelizeConnection
});

export default User;
