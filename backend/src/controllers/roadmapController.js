const Topic = require("../models/Topic");
const Roadmap = require("../models/Roadmap");

const generateRoadmap = async (req, res) => {
  try {
    const { subject, daysLeft, difficulty } = req.body;
    const userId = req.user.id;

    if (!subject || !daysLeft) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch topics
    let topics = await Topic.find({
      subject: new RegExp(`^${subject}$`, "i")
    });

    if (!topics.length) {
      return res.status(404).json({
      message: "No topics found for this subject. Please add topics first."
    });
}

    // Sort by priorityScore (better than string priority)
    topics.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

    // Decide hours per day
    const hoursPerDay =
      difficulty === "hard" ? 6 :
      difficulty === "medium" ? 4 : 2;

    const plan = [];
    let topicIndex = 0;

    for (let day = 1; day <= daysLeft && topicIndex < topics.length; day++) {
      let remainingHours = hoursPerDay;
      const dayTopics = [];

      while (remainingHours > 0 && topicIndex < topics.length) {
        const topic = topics[topicIndex];
        const hours = topic.estimatedHours || 1;

        if (hours <= remainingHours) {
          dayTopics.push({
            topicId: topic._id || null,
            name: topic.name || topic,
            estimatedHours: hours
          });

          remainingHours -= hours;
          topicIndex++;
        } else {
          break;
        }
      }

      plan.push({ day, topics: dayTopics });
    }

    const roadmap = await Roadmap.create({
      userId,
      subject,
      daysLeft,
      difficulty,
      plan
    });

    res.status(201).json({
      message: "Roadmap generated",
      roadmap
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    const roadmap = await Roadmap.find({ userId }).sort({ createdAt: -1 });

    if (!roadmap.length) {
      return res.status(404).json({ message: "No roadmap found" });
    }

    res.status(200).json({ roadmap });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  generateRoadmap,
  getMyRoadmap
};