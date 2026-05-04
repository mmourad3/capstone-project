import { prisma } from "../utils/database.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        questionnaire: true,
      },
    });

    const text = message.toLowerCase();

    let reply = "I can help you with roommates, dorms, and carpools.";

    if (text.includes("roommate")) {
      if (!user?.questionnaire) {
        reply = "Please complete your lifestyle questionnaire first so I can help you find better roommate matches.";
      } else {
        reply = `Based on your lifestyle, I can help match you with students who have similar habits like ${user.questionnaire.sleepSchedule}, ${user.questionnaire.cleanliness}, and ${user.questionnaire.socialLevel}.`;
      }
    } else if (text.includes("dorm")) {
      const dorms = await prisma.dormListing.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
      });

      if (dorms.length === 0) {
        reply = "There are no dorm listings available right now.";
      } else {
        reply = `I found ${dorms.length} recent dorm listings. You can check: ${dorms
          .map((d) => d.title)
          .join(", ")}.`;
      }
    } else if (text.includes("carpool")) {
      const carpools = await prisma.carpoolListing.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
      });

      if (carpools.length === 0) {
        reply = "There are no carpool listings available right now.";
      } else {
        reply = `I found ${carpools.length} carpool options. Check the carpool page for available rides.`;
      }
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({
      message: "AI bot failed",
      error: error.message,
    });
  }
};