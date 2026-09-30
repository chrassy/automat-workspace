"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message, statusCode = 200, meta) {
    const payload = {
        success: true,
        data,
        ...(message && { message }),
        ...(meta && { meta }),
    };
    return res.status(statusCode).json(payload);
}
function sendError(res, error, statusCode = 400, details) {
    const payload = {
        success: false,
        error,
        ...(details && { details }),
    };
    return res.status(statusCode).json(payload);
}
