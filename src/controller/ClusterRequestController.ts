import { Controller, RequestMapping } from "barmoury/api";
import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import ClusterRequest, { ClusterRequestRequest } from "../model/ClusterRequest";

@RequestMapping({ value: "/cluster-request", model: ClusterRequest })
export default class ClusterRequestController extends Controller<ClusterRequest, ClusterRequestRequest> {

  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<ClusterRequest> {
    return this.queryArmoury.getResourceByColumn(
      this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate(request: FastifyRequest, authentication: any, entity: ClusterRequest, entityRequest: ClusterRequestRequest): Promise<void> {
    entity.externalId = randomUUID();
  }

}