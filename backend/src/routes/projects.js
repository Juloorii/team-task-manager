const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET ALL PROJECTS
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        tasks: true
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE PROJECT (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.id
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE PROJECT (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.deleteMany({ where: { projectId: Number(id) } });
    await prisma.project.delete({ where: { id: Number(id) } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;