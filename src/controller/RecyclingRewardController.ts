import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import RecyclingReward , { RecyclingRewardRequest }from "../model/RecyclingReward";

@RequestMapping({ value: "/recycling-reward", model: RecyclingReward })
export default class RecyclingRewardController extends Controller<RecyclingReward, RecyclingRewardRequest> {

  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<RecyclingReward> {
    return this.queryArmoury.getResourceByColumn( 
        this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: RecyclingReward, entityRequest: RecyclingRewardRequest
  ): Promise<void> {
    entity.userId = authentication.id;
    entity.externalId = randomUUID();
  }
}