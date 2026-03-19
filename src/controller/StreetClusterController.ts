import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import StreetCluster, { StreetClusterRequest }  from "../model/StreetCluster";

@RequestMapping({ value: "/street-cluster", model: StreetCluster })
export default class StreetClusterController extends Controller<StreetCluster, StreetClusterRequest> {

  pageable: boolean = true;
  
  async getResourceById(id: any, authentication?: any): Promise<StreetCluster> {
    return this.queryArmoury.getResourceByColumn(
      this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: StreetCluster, entityRequest: StreetClusterRequest ): Promise<void> {
    entity.externalId = randomUUID();
  }
}