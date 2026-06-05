import express from 'express';
import { createTask, deleteTask, getTasks, reorderTasks, toggleTaskStatus, updateTask } from '../controller/taskController.js';



const router = express.Router();

router.get('/', getTasks);

router.post('/', createTask);

router.put('/:id', updateTask);

router.patch('/:id/toggle', toggleTaskStatus);

router.delete('/:id', deleteTask);

router.put('/reorder/bulk', reorderTasks);

export default router;