import { toPositiveIntOrUndefined } from "../utils/utils";

export const MAX_MAIL_ATTACHMENTS = toPositiveIntOrUndefined(process.env.MAX_MAIL_ATTACHMENTS) ?? 50;
