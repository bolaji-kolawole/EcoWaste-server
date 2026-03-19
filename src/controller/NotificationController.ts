import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import Notification, { NotificationRequest }  from "../model/Notification";

@RequestMapping({ value: "/notification", model: Notification })
export default class NotificationController extends Controller<Notification, NotificationRequest> {

  pageable: boolean = true;

  
  async getResourceById(id: any, authentication?: any): Promise<Notification> {
    return this.queryArmoury.getResourceByColumn(
      this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: Notification, entityRequest: NotificationRequest ): Promise<void> {
    entity.externalId = randomUUID();
  }
}