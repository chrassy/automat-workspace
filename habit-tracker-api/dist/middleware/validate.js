"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
const response_js_1 = require("../utils/response.js");
function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                (0, response_js_1.sendError)(res, 'Validation error', 400, error.issues);
                return;
            }
            next(error);
        }
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req.query);
            for (const key of Object.keys(req.query)) {
                delete req.query[key];
            }
            Object.assign(req.query, parsed);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                (0, response_js_1.sendError)(res, 'Validation error', 400, error.issues);
                return;
            }
            next(error);
        }
    };
}
