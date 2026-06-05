import mongoose from 'mongoose';
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    dueDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

TaskSchema.index({ title: 'text', description: 'text' });
TaskSchema.index({ createdAt: -1 });

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export default Task;