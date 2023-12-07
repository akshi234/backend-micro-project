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
