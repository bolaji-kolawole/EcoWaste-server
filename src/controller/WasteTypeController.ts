import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import WasteType, { WasteTypeRequest }  from "../model/WasteType";

@RequestMapping({ value: "/waste-type", model: WasteType })
export default class WasteTypeController extends Controller<WasteType, WasteTypeRequest> {

  pageable: boolean = true;

  
  async getResourceById(id: any, authentication?: any): Promise<WasteType> {
    return this.queryArmoury.getResourceByColumn(
      this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: WasteType, entityRequest: WasteTypeRequest ): Promise<void> {
    entity.externalId = randomUUID();
  }
}