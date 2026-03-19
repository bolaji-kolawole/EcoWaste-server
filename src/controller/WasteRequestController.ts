import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import WasteRequest, { WasteRequestRequest } from "../model/WasteRequest";

@RequestMapping({ value: "/waste-request", model: WasteRequest })
export default class WasteRequestController extends Controller<WasteRequest, WasteRequestRequest> {
  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<WasteRequest> {
    return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }


  async preCreate(request: FastifyRequest, authentication: any, entity: WasteRequest, entityRequest: WasteRequestRequest ): Promise<void> {
    entity.userId = authentication.id;
    entity.externalId = randomUUID();
  }
}