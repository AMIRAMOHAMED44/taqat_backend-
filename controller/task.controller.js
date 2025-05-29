import Task from "../model/Task.model.js";
import SubMain from "../model/SubMain.model.js";  // بدل Main استدعي SubMain

// إنشاء مهمة جديدة
export const createTask = async (req, res) => {
  try {
    const task = req.body;
    const userId = req._id;

    // التحقق من وجود subMainId وليس mainId
    const subMain = await SubMain.findById(task.subMainId);
    if (!subMain)
      return res
        .status(404)
        .json({ message: `No SubMain Website With This ID : ${task.subMainId}` });

    const newtask = new Task({
      ...task,
      userId: userId,
    });
    const savedtask = await newtask.save();
    res.status(201).json({
      message: "Task created successfully",
      task: savedtask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// جلب كل المهام
export const getAllTasks = async (req, res) => {
  try {
    // هنا عشان نعرض اسم الـ SubMain بدل Main
    const tasks = await Task.find().populate("subMainId", "name");
    if (tasks.length == 0)
      return res.status(404).json({ message: `No Tasks Available !` });

    res.status(200).json({
      message: "Tasks Is Available",
      total: tasks.length,
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// جلب مهمة بالـ ID
export const getTaskByID = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("subMainId", "name");
    if (!task)
      return res.status(404).json({ message: `This Task Is Not Available` });

    res.status(200).json({
      message: `This Task Is Available`,
      task: task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// تحديث المهمة
export const updateTask = async (req, res) => {
  try {
    const newtask = req.body;
    const data = await Task.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Task is not available" });
    }

    // حدث subMainId بدل mainId
    data.subMainId = newtask.subMainId || data.subMainId;
    data.username = newtask.username || data.username;
    data.date = newtask.date || data.date;
    data.tasks = newtask.tasks || data.tasks;
    data.remainingWork = newtask.remainingWork || data.remainingWork;

    // تحديث الرقم والملاحظات
    data.number = newtask.number !== undefined ? newtask.number : data.number;
    data.notes = newtask.notes !== undefined ? newtask.notes : data.notes;

    await data.save();
    res.status(200).json({
      message: "task updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// حذف المهمة
export const deleteTaskByID = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task)
      return res.status(404).json({ message: `This Task Is Not Available !` });

    res.status(200).json({
      message: `Task Is Deleted Successfully`,
      deletedTask: task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// تصدير المهام إلى ملف Excel
export const printTasks = async (req, res) => {
  try {
    // استدعاء المهام مع subMainId لعرض الاسم
    const tasks = await Task.find().populate("subMainId", "name").lean();

    const data = tasks.map((task) => ({
      "اسم الموظف": task.username,
      "الاسم الفرعي": task.subMainId?.name || "غير محدد", // استخدم subMainId بدلاً من mainId
      التاريخ: new Date(task.date).toLocaleDateString("ar-EG"),
      المهام: task.tasks,
      "العمل المتبقي": task.remainingWork,
      الرقم: task.number !== undefined ? task.number : "",
      الملاحظات: task.notes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=tasks.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    const stream = Readable.from(buffer);
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to export tasks.");
  }
};

// جلب بيانات SubMain حسب الـ ID (لو بتحتاجي)
export const getSubMainName = async (req, res) => {
  try {
    const { id } = req.params;
    const subMain = await SubMain.findById(id);
    if (!subMain)
      return res.status(404).json({ message: "No SubMain Website With This ID" });

    res.status(200).json({
      message: "SubMain Website Is Available",
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
