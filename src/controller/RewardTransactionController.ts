import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import RewardTransaction, { RewardTransactionRequest } from "../model/RewardTransaction";

@RequestMapping({ value: "/reward-transaction", model: RewardTransaction })
export default class RewardTransactionController extends Controller<RewardTransaction, RewardTransactionRequest> {

    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<RewardTransaction> {
        return this.queryArmoury.getResourceByColumn(
            this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
        );
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: RewardTransaction, entityRequest: RewardTransactionRequest
    ): Promise<void> {
        entity.externalId = randomUUID();
    }
}