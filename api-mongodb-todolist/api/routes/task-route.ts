import express, { NextFunction, Request, Response, Router } from "express";

const Task = require('../schema/task');

export const router = express.Router();


router.post('/tasks', async (req: Request, res: Response) => {
  console.log(req.body)
    const { title, status, date, description } = req.body;
  
    try {
      const task = new Task({ title, status, date, description  });
      console.log(task);
      await task.save();
      res.send(task);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  // Get allTask status
router.get('/tasks/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const tasks = await Task.find({ status });
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

  // Get One Task
  router.get('/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await Task.findById(id);
      res.send(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  

// Update a Task
router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, date, description } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { title, status, date, description });
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete a Tasks
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});


  module.exports = router;
