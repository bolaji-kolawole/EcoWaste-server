import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import RequestAssignment , { RequestAssignmentRequest }from "../model/RequestAssignment";

@RequestMapping({ value: "/request-assignment", model: RequestAssignment })
export default class RequestAssignmentController extends Controller<RequestAssignment, RequestAssignmentRequest> {

  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<RequestAssignment> {
    return this.queryArmoury.getResourceByColumn( 
        this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: RequestAssignment, entityRequest: RequestAssignmentRequest
  ): Promise<void> {
    entity.externalId = randomUUID();
  }
}