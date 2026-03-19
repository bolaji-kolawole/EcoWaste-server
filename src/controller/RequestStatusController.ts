import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import RequestStatus, { RequestStatusRequest } from "../model/RequestStatus";

@RequestMapping({ value: "/waste-request-status", model: RequestStatus })
export default class RequestStatusController extends Controller<RequestStatus, RequestStatusRequest> {
  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<RequestStatus> {
    return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate(request: FastifyRequest, authentication: any, entity: RequestStatus, entityRequest: RequestStatusRequest ): Promise<void> {
    entity.externalId = randomUUID();
  }
}