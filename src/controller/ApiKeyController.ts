import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import ApiKey, { ApiKeyRequest } from "../model/ApiKey";

@RequestMapping({ value: "/apikey", model: ApiKey })
export default class ApiKeyController extends Controller<ApiKey, ApiKeyRequest> {
    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<ApiKey> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));
    
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: ApiKey, entityRequest: ApiKeyRequest): Promise<void> {
        entity.externalId = randomUUID();
    }
}