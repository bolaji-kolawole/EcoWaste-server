import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import Role, { RoleRequest } from "../model/Role";

@RequestMapping({ value: "/role", model: Role })
export default class RoleController extends Controller<Role, RoleRequest> {
    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<Role> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));
    
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: Role, entityRequest: RoleRequest): Promise<void> {
        entity.externalId = randomUUID();
    }
}