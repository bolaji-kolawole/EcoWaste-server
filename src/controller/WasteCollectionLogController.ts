import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import WasteCollectionLog , { WasteCollectionLogRequest }from "../model/WasteCollectionLog";

@RequestMapping({ value: "/waste-collection-log", model: WasteCollectionLog })
export default class WasteCollectionLogController extends Controller<WasteCollectionLog, WasteCollectionLogRequest> {

  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<WasteCollectionLog> {
    return this.queryArmoury.getResourceByColumn( 
        this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: WasteCollectionLog, entityRequest: WasteCollectionLogRequest
  ): Promise<void> {
    entity.externalId = randomUUID();
  }
}