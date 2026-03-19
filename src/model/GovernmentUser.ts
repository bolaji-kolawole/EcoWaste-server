import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { RequestParamFilter } from "barmoury/eloquent";
import { Required, ColumnUnique, ColumnExists } from "barmoury/validation";
import GovernmentAgency from "./GovernmentAgency";

export interface GovernmentUserAttributes extends ModelAttributes {
  agencyId: string;
  name: string;
  email: string;
  externalId: string;
}

interface GovernmentUserInput extends ModelInput {}

export class GovernmentUser extends Model<GovernmentUserAttributes, GovernmentUserInput> {
  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public agencyId!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
  public name!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public email!: string;

  @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
  public externalId!: string;
}

export class GovernmentUserRequest extends BarmouryRequest {
  @Required()
  @ColumnExists({
    table: "government_agencies",
    column: "external_id",
    message: "Agency does not exist"
  })
  agencyId?: string;

  @Required()
  name?: string;

  @Required()
  email?: string;

  @Required() externalId?: string;
}

GovernmentUser.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  agencyId: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  externalId: { type: DataTypes.STRING, allowNull: false},
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "government_users",
  underscored: true,
  timestamps: true,
  sequelize: database.sequelizeConnection
});


export default GovernmentUser;