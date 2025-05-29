import express from "express";
import {
  createSubMain,
  getAllSubMain,
  getOneSubMain,
  updateSubMain,
  deleteSubMain
} from "../controller/submain.controller.js";
import { validation } from "../middleware/validate.js";
import { createSubMainValidation } from "../service/main.validation.js";
import { authentication } from "../middleware/auth.js";

const subMainRoutes = express.Router();

// جميع المسارات دي هتحتاج توكن
subMainRoutes.use(authentication);

// إنشاء موقع فرعي جديد
subMainRoutes
  .route("/create-submain")
  .post(validation(createSubMainValidation), createSubMain);

// جلب كل المواقع الفرعية
subMainRoutes.route('/').get(getAllSubMain);

// جلب موقع فرعي واحد - تعديل - حذف
subMainRoutes
  .route("/:id")
  .get(getOneSubMain)
  .patch(updateSubMain)
  .delete(deleteSubMain);

export default subMainRoutes;
 