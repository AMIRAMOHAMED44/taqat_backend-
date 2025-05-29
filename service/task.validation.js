import joi from "joi";

let createTaskValidation = joi.object({
  userId: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid userId format")
    .optional(),

  subMainId: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid subMainId format")
    .required(),  

  username: joi.string().min(3).trim().required().messages({
    "string.empty": "Username is required",
    "string.min": "Username should be at least 3 characters",
  }),

  date: joi.date().iso().required().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format (YYYY-MM-DD)",
  }),

  tasks: joi.string().min(3).trim().required().messages({
    "string.empty": "Tasks field is required",
    "string.min": "Tasks should be at least 3 characters",
  }),

  remainingWork: joi.string().min(3).trim().optional().messages({
    "string.min": "Remaining work should be at least 3 characters",
  }),

  number: joi.alternatives()
    .try(joi.number().integer().positive(), joi.string().trim())
    .optional()
    .messages({
      "number.base": "Number must be a positive integer or string",
    }),

  notes: joi.string().trim().optional().messages({
    "string.base": "Notes must be a string",
  }),
});

export { createTaskValidation };
