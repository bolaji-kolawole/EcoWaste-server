import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import UserRole, { UserRoleRequest } from "../model/UserRole";

@RequestMapping({ value: "/user-role", model: UserRole })
export default class UserRoleController extends Controller<UserRole, UserRoleRequest> {
    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<UserRole> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));
    
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: UserRole, entityRequest: UserRoleRequest): Promise<void> {
        entity.externalId = randomUUID();
    }
}