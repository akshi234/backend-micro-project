const Weeklist = require("../models/weeklist");
const express = require("express");
// const bodyParser = require("body-parser");
const router = express.Router();

// API to add a week list
router.post("/api/weeklist", (req, res) => {
  const now = new Date();
  const newWeekList = {
    id: Weeklist.length + 1,
    tasks: req.body.tasks,
    createdAt: now,
    updatedAt: now,
    completedTasks: [],
  };

  // Check if the user has more than two active week lists
  if (Weeklist.filter((list) => !list.completedAt).length >= 2) {
    return res
      .status(400)
      .json({ error: "You can only have two active week lists at a time." });
  }

  Weeklist.push(newWeekList);
  res.status(201).json(newWeekList);
});

// API to update or delete a week list
router.put("/api/weeklist/:id", (req, res) => {
  const weekListId = parseInt(req.params.id);
  const updatedWeekList = Weeklist.find((list) => list.id === weekListId);

  if (!updatedWeekList) {
    return res.status(404).json({ error: "Week list not found." });
  }

  const currentTime = new Date();
  const timeDifference = currentTime - updatedWeekList.createdAt;

  // Check if 24 hours have passed since the week list was created
  if (timeDifference > 24 * 60 * 60 * 1000) {
    return res
      .status(400)
      .json({ error: "Cannot update or delete the week list after 24 hours." });
  }

  // Update description/task or delete the week list
  if (req.body.description) {
    updatedWeekList.description = req.body.description;
  }

  if (req.body.tasks) {
    updatedWeekList.tasks = req.body.tasks;
  }

  if (req.body.deleted) {
    updatedWeekList.deleted = true;
  }

  updatedWeekList.updatedAt = currentTime;

  res.status(200).json(updatedWeekList);
});

// API to mark/unmark a task in the week list
router.patch("/api/weeklist/:id/mark-task/:taskId", (req, res) => {
  const weekListId = parseInt(req.params.id);
  const taskId = parseInt(req.params.taskId);
  const weekList = weekLists.find((list) => list.id === weekListId);

  if (!weekList) {
    return res.status(404).json({ error: "Week list not found." });
  }

  const taskIndex = weekList.tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found." });
  }

  const currentTime = new Date();
  const isTaskCompleted = weekList.completedTasks.includes(taskId);

  if (isTaskCompleted) {
    weekList.completedTasks = weekList.completedTasks.filter(
      (completedTask) => completedTask !== taskId
    );
  } else {
    weekList.completedTasks.push(taskId);
  }

  // Save the time the task was marked true
  weekList.tasks[taskIndex].completedAt = isTaskCompleted ? null : currentTime;

  res.status(200).json(weekList);
});

// API to get all week lists with time left to complete
router.get("/api/weeklists", (req, res) => {
  const currentTime = new Date();

  const weekListsInfo = weekLists.map((weekList) => {
    const timeDifference = weekList.createdAt - currentTime;
    const timeLeft = Math.max(0, 24 * 60 * 60 * 1000 - timeDifference);

    return {
      id: weekList.id,
      tasks: weekList.tasks,
      timeLeft: timeLeft,
    };
  });

  res.status(200).json(weekListsInfo);
});

// Middleware to check if the week list is still active or completed
const checkWeekListStatus = (req, res, next) => {
  const weekListId = parseInt(req.params.id);
  const weekList = weekLists.find((list) => list.id === weekListId);

  if (!weekList) {
    return res.status(404).json({ error: "Week list not found." });
  }

  const currentTime = new Date();
  const timeDifference = currentTime - weekList.createdAt;

  if (timeDifference > 24 * 60 * 60 * 1000) {
    // If more than 24 hours have passed, mark the week list as inactive
    weekList.status = "inactive";
  }

  if (weekList.isCompleted) {
    // If the week list is completed, lock it
    weekList.locked = true;
  }

  next();
};

// API to mark/unmark a task in the week list
app.patch(
  "/api/weeklist/:id/mark-task/:taskId",
  checkWeekListStatus,
  (req, res) => {
    const weekListId = parseInt(req.params.id);
    const taskId = parseInt(req.params.taskId);
    const weekList = weekLists.find((list) => list.id === weekListId);

    if (weekList.locked) {
      return res
        .status(400)
        .json({ error: "Cannot unmark tasks in a completed week list." });
    }

    // ... (existing logic for marking/unmarking tasks)

    res.status(200).json(weekList);
  }
);

module.exports = router;
