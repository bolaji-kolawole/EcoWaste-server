import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import RecyclingCompany , { RecyclingCompanyRequest }from "../model/RecyclingCompany";

@RequestMapping({ value: "/recycling-company", model: RecyclingCompany })
export default class RecyclingCompanyController extends Controller<RecyclingCompany, RecyclingCompanyRequest> {

  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<RecyclingCompany> {
    return this.queryArmoury.getResourceByColumn( 
        this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: RecyclingCompany, entityRequest: RecyclingCompanyRequest
  ): Promise<void> {
    entity.externalId = randomUUID();
  }
}