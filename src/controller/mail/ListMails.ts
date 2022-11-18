import Joi from "joi";

// TODO: implement

const dtoInSchema = Joi.object({
  connectionId: Joi.number().required(),
});

class ListMails {
  constructor() {}
}
