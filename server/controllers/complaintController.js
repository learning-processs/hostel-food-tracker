import complaintModel from "../models/complaintModel.js";
import { GoogleGenAI } from '@google/genai';
import sendEmail from "../utils/sendEmail.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @route   POST /api/complaints
// @access  Private (student)
export const submitComplaint = async (req, res, next) => {
  try {
    const { description, photoUrl, mealType, date, isAnonymous } = req.body;

    if (!description) {
      res.status(400);
      throw new Error('Description is required');
    }

    // Ask the AI to classify the complaint into one of our 5 fixed categories
    let category = 'uncategorized';
    try {
    const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: `You are a classifier for hostel mess complaints. Read the complaint and respond with EXACTLY ONE WORD from this list: taste, hygiene, quantity, variety, service. Respond with nothing else.\n\nComplaint: "${description}"`,
    });

    const aiCategory = aiResponse.text.trim().toLowerCase();
    const validCategories = ['taste', 'hygiene', 'quantity', 'variety', 'service'];

    if (validCategories.includes(aiCategory)) {
        category = aiCategory;
    }
    } catch (aiError) {
    console.error('AI categorization failed, defaulting to uncategorized:', aiError.message);
    }

    const complaint = await complaintModel.create({
      student: req.user._id,
      isAnonymous: !!isAnonymous,
      description,
      photoUrl,
      mealType,
      date: date ? new Date(date) : new Date(),
      category,
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};


// @route   GET /api/complaints
// @access  Private (mess_manager, admin)
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintModel
      .find()
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    // Mask the student's identity for any complaint marked anonymous
    const sanitized = complaints.map((c) => {
      const obj = c.toObject();
      if (obj.isAnonymous) {
        obj.student = { name: 'Anonymous', email: null };
      }
      return obj;
    });

    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/complaints/me
// @access  Private (student)
export const getMyComplaints = async (req, res, next) => {
  try {
    // Students always see their own name on their own complaints, regardless of isAnonymous
    const complaints = await complaintModel.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/complaints/:id/vote
// @access  Private (student)
export const voteComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintModel.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    const alreadyVoted = complaint.votes.some((id) => id.equals(req.user._id));

    if (alreadyVoted) {
      // Voting again removes the vote (toggle behavior)
      complaint.votes = complaint.votes.filter((id) => !id.equals(req.user._id));
    } else {
      complaint.votes.push(req.user._id);
    }

    await complaint.save();
    res.json({ voteCount: complaint.votes.length, voted: !alreadyVoted });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/complaints/:id/reply
// @access  Private (mess_manager)
export const replyToComplaint = async (req, res, next) => {
  try {
    const { messManagerReply, status } = req.body;

    const complaint = await complaintModel.findById(req.params.id).populate('student', 'name email');

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (messManagerReply) complaint.messManagerReply = messManagerReply;
    if (status) complaint.status = status;

    await complaint.save();

    // Notify the student who filed it — even if they submitted anonymously to
    // the mess manager, they still deserve to know their own complaint was addressed
    if (complaint.student?.email) {
      sendEmail({
        to: complaint.student.email,
        subject: 'Update on your mess complaint',
        html: `
          <p>Hi ${complaint.student.name},</p>
          <p>Your complaint has been updated to status: <strong>${complaint.status}</strong></p>
          ${messManagerReply ? `<p>Mess manager's reply: ${messManagerReply}</p>` : ''}
        `,
      });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};