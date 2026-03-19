import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import Report, { ReportRequest } from "../model/Report";

@RequestMapping({ value: "/report", model: Report })
export default class ReportController extends Controller<Report, ReportRequest> {

    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<Report> {
        return this.queryArmoury.getResourceByColumn(
            this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
        );
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: Report, entityRequest: ReportRequest
    ): Promise<void> {
        entity.externalId = randomUUID();
    }
}