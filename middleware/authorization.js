const Premium = (req, res, next) => {
  if (req.user.isPremium) {
    next();
  } else {
    res.json({
      status: "FAILED",
      message: "You have not premium user .Please buy premium plan",
    });
  }
};

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
