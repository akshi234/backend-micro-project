const Weeklist = require("../models/weekList");
const express = require("express");
const router = express.Router();

// API to add a week list
router.post("/api/weeklist", (req, res) => {
  console.log("Received POST request at /api/weeklist");
  const now = new Date();
  const newWeekList = {
    id: Weeklist.length + 1,
    tasks: req.body.tasks,
    createdAt: now,
    updatedAt: now,
    completedTasks: [],
  };
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

  if (timeDifference > 24 * 60 * 60 * 1000) {
    return res
      .status(400)
      .json({ error: "Cannot update or delete the week list after 24 hours." });
  }

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
router.post("/api/weeklist/:id/marktask/:taskId", (req, res) => {
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

//feed API
router.get("/api/feed", (req, res) => {
  const currentTime = new Date();

  const activeWeekLists = Weeklist.filter((weekList) => {
    const timeDifference = currentTime - weekList.createdAt;
    return timeDifference <= 24 * 60 * 60 * 1000 && !weekList.isCompleted;
  });

  const feedInfo = activeWeekLists.map((weekList) => {
    return {
      id: weekList.id,
      tasks: weekList.tasks,
    };
  });

  res.status(200).json(feedInfo);
});

// Middleware
const checkWeekListStatus = (req, res, next) => {
  const weekListId = parseInt(req.params.id);
  const weekList = Weeklist.find((list) => list.id === weekListId);

  if (!weekList) {
    return res.status(404).json({ error: "Week list not found." });
  }

  const currentTime = new Date();
  const timeDifference = currentTime - weekList.createdAt;

  if (timeDifference > 24 * 60 * 60 * 1000) {
    weekList.status = "inactive";
    weekList.isCompleted = true;
  }

  if (weekList.isCompleted) {
    weekList.locked = true;
  }

  next();
};

module.exports = router;
