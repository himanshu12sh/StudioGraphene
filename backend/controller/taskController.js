import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort({createdAt: -1 , order: 1});

    const activeCount = await Task.countDocuments({ status: 'active' });
    const completedCount = await Task.countDocuments({ status: 'completed' });

    res.json({
      tasks,
      counts: {
        active: activeCount,
        completed: completedCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const lastTask = await Task.findOne().sort({ order: -1 });
    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: 'active',
      order: newOrder
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim() || undefined;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

export const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'active' ? 'completed' : 'active';

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling task', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Tasks array is required' });
    }

    const bulkOps = tasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { $set: { order: index } }
      }
    }));

    await Task.bulkWrite(bulkOps);

    const updatedTasks = await Task.find().sort({ order: 1, createdAt: -1 });

    res.json({
      message: 'Tasks reordered successfully',
      tasks: updatedTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering tasks', error: error.message });
  }
};