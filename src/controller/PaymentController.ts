import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import Payment, { PaymentRequest } from "../model/Payment";

@RequestMapping({ value: "/payment", model: Payment })
export default class PaymentController extends Controller<Payment, PaymentRequest> {
    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<Payment> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: Payment, entityRequest: PaymentRequest): Promise<void> {
        entity.externalId = randomUUID();
        entity.userId = authentication.id;
    }
}