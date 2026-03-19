import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import Address, { AddressRequest } from "../model/Address";

@RequestMapping({ value: "/address", model: Address })
export default class AddressController extends Controller<Address, AddressRequest> {
    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<Address> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));
    
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: Address, entityRequest: AddressRequest): Promise<void> {
        entity.userId = authentication.id;
        entity.externalId = randomUUID();
    }
}