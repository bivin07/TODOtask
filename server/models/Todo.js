import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    required: true,
    default: "pending",
  },
}, { timestamps: true });

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;
