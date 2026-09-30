"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const response_js_1 = require("../utils/response.js");
class AppError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
function notFoundHandler(req, res) {
    (0, response_js_1.sendError)(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        (0, response_js_1.sendError)(res, err.message, err.statusCode, err.details);
        return;
    }
    // Handle SyntaxError for bad JSON body
    if (err instanceof SyntaxError && 'body' in err) {
        (0, response_js_1.sendError)(res, 'Malformed JSON in request body', 400);
        return;
    }
    console.error('Unhandled Server Error:', err);
    (0, response_js_1.sendError)(res, 'Internal Server Error', 500);
}
