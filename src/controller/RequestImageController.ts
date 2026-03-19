import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import RequestImage , { RequestImageRequest }from "../model/RequestImage";

@RequestMapping({ value: "/request-image", model: RequestImage })
export default class RequestImageController extends Controller<RequestImage, RequestImageRequest> {

  pageable: boolean = true;

  async getResourceById(id: any, authentication?: any): Promise<RequestImage> {
    return this.queryArmoury.getResourceByColumn( 
        this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: RequestImage, entityRequest: RequestImageRequest
  ): Promise<void> {
    entity.externalId = randomUUID();
  }
}