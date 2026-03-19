import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import UserSubscription, { UserSubscriptionRequest } from "../model/UserSubscription";

@RequestMapping({ value: "/user-subscription-plan", model: UserSubscription })
export default class UserSubscriptionController extends Controller<UserSubscription, UserSubscriptionRequest> {
    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<UserSubscription> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));
    
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: UserSubscription, entityRequest: UserSubscriptionRequest): Promise<void> {
        entity.userId = authentication.id;
        entity.externalId = randomUUID();
    }
}