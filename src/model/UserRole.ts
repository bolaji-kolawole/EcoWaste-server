import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { Required, ColumnExists } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";

export interface UserRoleAttributes extends ModelAttributes {
    userId: string;
    roleId: string;
    externalId: string;
}

interface UserRoleInput extends ModelInput { }

export class UserRole extends Model<UserRoleAttributes, UserRoleInput> {

    @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public userId!: string;
    @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ }) public roleId!: string;
    public externalId!: string;
}

export class UserRoleRequest extends BarmouryRequest {

    @Required()
    @ColumnExists({ table: "roles", column: "external_id", message: "Role does not exist" })
    roleId!: string;
    @Required()
    @ColumnExists({ table: "users", column: "external_id", message: "User does not exist" })
    userId!: string;

}

UserRole.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    externalId: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
    timestamps: true,
    underscored: true,
    tableName: "user_roles",
    sequelize: database.sequelizeConnection
});

export default UserRole;