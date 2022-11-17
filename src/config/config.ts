import { toPositiveIntOrUndefined } from "../utils/utils";

export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = toPositiveIntOrUndefined(process.env.PORT) ?? 8080;
export const MAX_MAIL_ATTACHMENTS = toPositiveIntOrUndefined(process.env.MAX_MAIL_ATTACHMENTS) ?? 50;
