import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:false,
  },
  subMainId: {                 
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubMain",           
    required: false,
  },
  username: {
    type: String,
    trim: true,
    required: false,
  },
  date: {
    type: Date,
    required: false,
  },
  tasks: {
    type: String,
    required: false,
    trim: true,
  },
  remainingWork: {
    type: String,
    required: false,
    trim: true,
  },
  number: {
    type: Number,
    required: false,
  },
  notes: {
    type: String,
    trim: true,
    required: false,
  },
}, {
  timestamps: true
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
