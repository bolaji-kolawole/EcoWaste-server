import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import PickupSchedule, { PickupScheduleRequest }  from "../model/PickupSchedule";

@RequestMapping({ value: "/pickup-schedule", model: PickupSchedule })
export default class PickupScheduleController extends Controller<PickupSchedule, PickupScheduleRequest> {

  pageable: boolean = true;
  
  async getResourceById(id: any, authentication?: any): Promise<PickupSchedule> {
    return this.queryArmoury.getResourceByColumn(
      this.t1Constructor, "externalId", id,
      Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
    );
  }

  async preCreate( request: FastifyRequest, authentication: any, entity: PickupSchedule, entityRequest: PickupScheduleRequest ): Promise<void> {
    entity.externalId = randomUUID();
  }
}