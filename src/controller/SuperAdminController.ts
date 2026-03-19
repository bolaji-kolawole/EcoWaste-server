import { Controller, RequestMapping, RequestMethod } from "barmoury/api";
import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { MODEL_REGISTRY } from "../model/ModelRegistry";

@RequestMapping({ value: "/super-admin/:model" })
export default class SuperAdminController extends Controller<any, any> {

  pageable = true;

  private getConfig(modelName: string) {
    const config = MODEL_REGISTRY[modelName];

    if (!config) {
      throw new Error(`Model '${modelName}' not found`);
    }

    return config;
  }

  /**
   * Apply model-level transformations
   */
  private async transformPayload(config: any, payload: any) {
    const data = { ...payload };

    if (config.hashPassword && data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return data;
  }

  /**
   * LIST
   */
  @RequestMapping({ method: RequestMethod.GET })
  async list(request: FastifyRequest, reply: FastifyReply) {
    const { model } = request.params as any;
    const config = this.getConfig(model);
    const { model: Model, hiddenFields = [] } = config;

    const data = await Model.findAll({
      attributes: { exclude: hiddenFields }
    });

    return this.processResponse(reply, 200, data, `${model} fetched successfully`);
  }

  /**
   * GET ONE
   */
  @RequestMapping({ value: "/:id", method: RequestMethod.GET })
  async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { model, id } = request.params as any;
    const config = this.getConfig(model);
    const { model: Model, hiddenFields = [] } = config;

    const record = await Model.findOne({
      where: { externalId: id },
      attributes: { exclude: hiddenFields }
    });

    if (!record) {
      return this.processResponse(reply, 404, null, `${model} not found`);
    }

    return this.processResponse(reply, 200, record, `${model} fetched successfully`);
  }

  /**
   * CREATE
   */
  @RequestMapping({ method: RequestMethod.POST })
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { model } = request.params as any;
    const config = this.getConfig(model);
    const { model: Model, request: RequestClass } = config;

    let payload: any = request.body;

    // validate request if class exists
    if (RequestClass) {
      try {
        // Case 1: class-based validator
        if (typeof RequestClass === "function") {
          const instance = new RequestClass();

          if (typeof instance.validate === "function") {
            payload = instance.validate(payload);
          }
        }

        // Case 2: function-based validator
        else if (typeof RequestClass === "function") {
          payload = RequestClass(payload);
        }

      } catch (err: any) {
        return this.processResponse(reply, 400, null, err.message);
      }
    }

    payload.externalId = randomUUID();

    payload = await this.transformPayload(config, payload);

    const record = await Model.create(payload);

    return this.processResponse(
      reply,
      200,
      record,
      `${model} created successfully`
    );
  }

  /**
   * UPDATE
   */
  @RequestMapping({ value: "/:id", method: RequestMethod.PATCH })
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { model, id } = request.params as any;
    const config = this.getConfig(model);
    const { model: Model, request: RequestClass } = config;

    let payload: any = request.body;
    if (RequestClass) {
      try {
        // Case 1: class-based validator
        if (typeof RequestClass === "function") {
          const instance = new RequestClass();

          if (typeof instance.validate === "function") {
            payload = instance.validate(payload);
          }
        }

        // Case 2: function-based validator
        else if (typeof RequestClass === "function") {
          payload = RequestClass(payload);
        }

      } catch (err: any) {
        return this.processResponse(reply, 400, null, err.message);
      }
    }

    payload = await this.transformPayload(config, payload);

    const [updated] = await Model.update(payload, {
      where: { externalId: id }
    });

    if (!updated) {
      return this.processResponse(reply, 404, null, `${model} not found`);
    }

    const updatedRecord = await Model.findOne({
      where: { externalId: id }
    });

    return this.processResponse(
      reply,
      200,
      updatedRecord,
      `${model} updated successfully`
    );
  }

  /**
   * DELETE
   */
  @RequestMapping({ value: "/:id", method: RequestMethod.DELETE })
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { model, id } = request.params as any;
    const config = this.getConfig(model);
    const { model: Model } = config;

    const deleted = await Model.destroy({
      where: { externalId: id }
    });

    if (!deleted) {
      return this.processResponse(reply, 404, null, `${model} not found`);
    }

    return this.processResponse(
      reply,
      200,
      null,
      `${model} deleted successfully`
    );
  }
}