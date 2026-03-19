import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import NotificationLog, { NotificationLogRequest }  from "../model/NotificationLog";

@RequestMapping({ value: "/notification-log", model: NotificationLog })
export default class NotificationLogController extends Controller<NotificationLog, NotificationLogRequest> {

  pageable: boolean = true;
  
  async getResourceById(id: any, authentication?: any): Promise<NotificationLog> {
    return this.queryArmoury.getResourceByColumn(
      this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: NotificationLog, entityRequest: NotificationLogRequest ): Promise<void> {
    entity.externalId = randomUUID();
  }
}