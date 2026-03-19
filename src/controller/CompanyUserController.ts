import { Controller, RequestMapping, RequestMethod } from "barmoury/api";
import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import CompanyUser, { CompanyUserRequest } from "../model/CompanyUser";
import { Validated } from "barmoury/validation";

@RequestMapping({ value: "/company-user", model: CompanyUser })
export default class CompanyUserController extends Controller<CompanyUser, CompanyUserRequest> {

  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<CompanyUser> {
    return this.queryArmoury.getResourceByColumn(
      this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate(request: FastifyRequest, authentication: any, entity: CompanyUser, entityRequest: CompanyUserRequest): Promise<void> {
    entity.externalId = randomUUID();
  }

}