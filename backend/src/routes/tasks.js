const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET ALL TASKS
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE TASK (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, projectId, assignedToId, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: Number(projectId),
        assignedToId: assignedToId ? Number(assignedToId) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'todo'
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE TASK STATUS
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description, assignedToId, dueDate } = req.body;

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(description && { description }),
        ...(assignedToId && { assignedToId: Number(assignedToId) }),
        ...(dueDate && { dueDate: new Date(dueDate) })
      }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE TASK (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;