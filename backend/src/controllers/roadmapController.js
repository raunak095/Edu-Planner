import Topic from "../models/Topic.js";

import Roadmap from "../models/Roadmap.js";

// ================= GENERATE ROADMAP =================
export const generateRoadmap = async (req, res) => {

  try {

    const {
      subject,
      daysLeft,
      difficulty,
    } = req.body;

    const userId = req.user.id;

    // ✅ Validation
    if (!subject || !daysLeft) {

      return res.status(400).json({

        message:
          "Missing required fields",

      });

    }

    // ================= FETCH TOPICS =================
    let topics = await Topic.find({

      subject: new RegExp(
        `^${subject}$`,
        "i"
      ),

    });

    // ================= AI FALLBACK =================
    if (!topics.length) {

      console.log(
        "⚠️ No DB topics found. Using AI fallback topics."
      );

      const generatedTopics = [

        {

          name:
            `${subject} Fundamentals`,

          estimatedHours: 2,

          priorityScore: 10,

        },

        {

          name:
            `Core Concepts of ${subject}`,

          estimatedHours: 3,

          priorityScore: 9,

        },

        {

          name:
            `Advanced ${subject} Topics`,

          estimatedHours: 4,

          priorityScore: 8,

        },

        {

          name:
            `${subject} Problem Solving`,

          estimatedHours: 3,

          priorityScore: 7,

        },

        {

          name:
            `${subject} Interview Questions`,

          estimatedHours: 2,

          priorityScore: 6,

        },

      ];

      topics = generatedTopics;

    }

    // ================= SORT TOPICS =================
    topics.sort(

      (a, b) =>

        (b.priorityScore || 0) -

        (a.priorityScore || 0)

    );

    // ================= HOURS PER DAY =================
    const hoursPerDay =

      difficulty === "hard"
        ? 6
        : difficulty === "medium"
        ? 4
        : 2;

    const plan = [];

    let topicIndex = 0;

    // ================= BUILD ROADMAP =================
    for (

      let day = 1;

      day <= daysLeft &&
      topicIndex < topics.length;

      day++

    ) {

      let remainingHours =
        hoursPerDay;

      const dayTopics = [];

      while (

        remainingHours > 0 &&
        topicIndex < topics.length

      ) {

        const topic =
          topics[topicIndex];

        const hours =
          topic.estimatedHours || 1;

        if (hours <= remainingHours) {

          dayTopics.push({

            topicId:
              topic._id || null,

            name:
              topic.name || topic,

            estimatedHours:
              hours,

          });

          remainingHours -= hours;

          topicIndex++;

        } else {

          break;

        }

      }

      plan.push({

        day,

        topics: dayTopics,

      });

    }

    // ================= SAVE ROADMAP =================
    const roadmap =
      await Roadmap.create({

        userId,

        subject,

        daysLeft,

        difficulty,

        plan,

      });

    res.status(201).json({

      message:
        "Roadmap generated successfully",

      roadmap,

    });

  } catch (err) {

    console.error(
      "Roadmap Generation Error:",
      err
    );

    res.status(500).json({

      message: err.message,

    });

  }

};

// ================= GET MY ROADMAP =================
export const getMyRoadmap = async (req, res) => {

  try {

    const userId = req.user.id;

    const roadmap =
      await Roadmap.find({

        userId,

      }).sort({

        createdAt: -1,

      });

    if (!roadmap.length) {

      return res.status(404).json({

        message:
          "No roadmap found",

      });

    }

    res.status(200).json({

      roadmap,

    });

  } catch (err) {

    console.error(
      "Get Roadmap Error:",
      err
    );

    res.status(500).json({

      message: err.message,

    });

  }

};