import { Controller, RequestMapping } from "barmoury/api";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import PublicReport, { PublicReportRequest } from "../model/PublicReport";

@RequestMapping({ value: "/public-report", model: PublicReport })
export default class PublicReportController extends Controller<PublicReport, PublicReportRequest> {

    pageable: boolean = true;

    async getResourceById(id: any, authentication?: any): Promise<PublicReport> {
        return this.queryArmoury.getResourceByColumn(
            this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName)
        );
    }

    async preCreate(request: FastifyRequest, authentication: any, entity: PublicReport, entityRequest: PublicReportRequest): Promise<void> {
        entity.externalId = randomUUID();
    }
}