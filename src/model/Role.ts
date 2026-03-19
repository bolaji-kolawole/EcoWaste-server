import { DataTypes } from "sequelize";
import database from "../config/DatabaseConfig";
import { Model, Request as BarmouryRequest, ModelInput, ModelAttributes } from "barmoury/api";
import { ColumnUnique, Required } from "barmoury/validation";
import { RequestParamFilter } from "barmoury/eloquent";
import User from "./User"; // if you want to relate roles to users

export interface RoleAttributes extends ModelAttributes {
    name: string;
    description: string;
    extraData?: JSON;
    externalId: string;
}

interface RoleInput extends ModelInput { }

export class Role extends Model<RoleAttributes, RoleInput> {

    @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
    public name!: string;

    @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
    public description!: string;

    @RequestParamFilter({ operator: RequestParamFilter.Operator.LIKE })
    public extraData?: JSON;

    @RequestParamFilter({ operator: RequestParamFilter.Operator.EQ })
    public externalId!: string;
}

export class RoleRequest extends BarmouryRequest {

    @Required()
    @ColumnUnique({
        table: "roles",
        column: "name",
        message: "The role '{value}' already exists"
    })
    name?: string;

    @Required()
    description?: string;

    extraData?: JSON;
    externalId?: string;
}

Role.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    extraData: { type: DataTypes.JSON, allowNull: true },
    externalId: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
    timestamps: true,
    underscored: true,
    tableName: "roles",
    sequelize: database.sequelizeConnection
});

export default Role;