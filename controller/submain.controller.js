import Main from "../model/Main.model.js";
import SubMain from "../model/SubMain.model.js";

// إنشاء موقع فرعي جديد
export const createSubMain = async (req, res) => {
  try {
    const subMain = req.body;
    const userId = req._id;
    const mainId = await Main.findById({ _id: subMain.mainId });
    if (!mainId)
      return res
        .status(404)
        .json({ message: `No Main Website with this ID : ${subMain.mainId}` });

    const newSubMain = new SubMain({
      userId,
      mainId,
      name: subMain.name,
    });

    const savedMain = await newSubMain.save();
    res.status(201).json({
      message: "Sub Main created successfully",
      subMain: savedMain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// جلب كل المواقع الفرعية
export const getAllSubMain = async (req, res) => {
  try {
    const { mainId } = req.query;

    const filter = {};
    if (mainId) {
      filter.mainId = mainId;
    }

    const data = await SubMain.find(filter).populate("mainId");

    if (data.length === 0) {
      return res.status(404).json({ message: "لا توجد مواقع فرعية متاحة!" });
    }

    res.status(200).json({
      message: "تم جلب المواقع الفرعية بنجاح",
      total: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "حدث خطأ في الخادم",
      error: error.message,
    });
  }
};

// جلب موقع فرعي واحد
export const getOneSubMain = async (req, res) => {
  try {
    const { id } = req.params;
    const subMain = await SubMain.findById(id).populate("mainId");
    if (!subMain)
      return res.status(404).json({ message: `No Sub Main With This ID` });
    res.status(200).json({
      message: "Sub Main fetched successfully",
      data: subMain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// تحديث موقع فرعي
export const updateSubMain = async (req, res) => {
  try {
    const newdata = req.body;
    const data = await SubMain.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data is not available" });
    }

    data.mainId = newdata.mainId || data.mainId;
    data.name = newdata.name || data.name;
    await data.save();

    res.status(200).json({
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// حذف موقع فرعي
export const deleteSubMain = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SubMain.findByIdAndDelete(id);
    if (!data)
      return res.status(404).json({ message: "Data is not available" });

    res.status(200).json({
      message: "Data is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
