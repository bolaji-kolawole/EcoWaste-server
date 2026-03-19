import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import SubscriptionPlan, { SubscriptionPlanRequest } from "../model/SubscriptionPlan";

@RequestMapping({ value: "/subscription-plan", model: SubscriptionPlan })
export default class SubscriptionPlanController extends Controller<SubscriptionPlan, SubscriptionPlanRequest> {
    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<SubscriptionPlan> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));
    
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: SubscriptionPlan, entityRequest: SubscriptionPlanRequest): Promise<void> {
        entity.externalId = randomUUID();
    }
}