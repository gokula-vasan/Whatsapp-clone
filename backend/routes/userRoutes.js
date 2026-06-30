import express from "express";
import User from "../models/User.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ensure uploads directory exists on startup to prevent Multer write crashes
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Centralized helper to format absolute profile image URL
const getProfileImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const separator = imagePath.startsWith("/") ? "" : "/";
  return `${req.protocol}://${req.get('host')}${separator}${imagePath}`;
};

// 1. ADDED: Get all users API (essential for starting chats in a WhatsApp clone)
// GET /api/users/
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    const formattedUsers = users.map(user => ({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: getProfileImageUrl(req, user.profileImage)
    }));
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. ADDED: Get user by ID API (essential for referencing users by database ID)
// GET /api/users/id/:id
router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: getProfileImageUrl(req, user.profileImage)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by Phone api
// GET /api/users/:phone
router.get("/:phone", async (req, res) => {
  try {
    const rawPhone = req.params.phone;
    let user = await User.findOne({ phone: rawPhone });

    if (!user) {
      // Normalize: remove '+', spaces, and check various permutations
      const cleanPhone = rawPhone.replace(/[\s\+]/g, "");
      user = await User.findOne({
        $or: [
          { phone: cleanPhone },
          { phone: `+${cleanPhone}` },
          { phone: ` ${cleanPhone}` }, // handles leading space in DB, e.g. " 919562462397"
          { phone: ` +${cleanPhone}` },
          { phone: rawPhone.trim() }
        ]
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: getProfileImageUrl(req, user.profileImage)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create User with image upload API
// POST /api/users/
router.post("/", upload.single("profileImage"), async (req, res) => {
  const { phone, name } = req.body;

  try {
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }
    
    // Normalize clean phone to check for duplicates
    const cleanPhone = phone.replace(/[\s\+]/g, "");
    let user = await User.findOne({
      $or: [
        { phone: phone },
        { phone: phone.trim() },
        { phone: cleanPhone },
        { phone: `+${cleanPhone}` },
        { phone: ` ${cleanPhone}` }
      ]
    });
    
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Save phone with leading and trailing spaces trimmed to prevent space bugs
    user = new User({ phone: phone.trim(), name, profileImage });
    await user.save();

    res.status(201).json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: getProfileImageUrl(req, user.profileImage)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Setup User Profile - Update name for existing user
// POST /api/users/setup
router.post("/setup", async (req, res) => {
  const { phone, name } = req.body;

  try {
    if (!phone || !name) {
      return res.status(400).json({ message: "Phone and name are required" });
    }

    const cleanPhone = phone.replace(/[\s\+]/g, "");
    let user = await User.findOne({
      $or: [
        { phone: phone },
        { phone: phone.trim() },
        { phone: cleanPhone },
        { phone: `+${cleanPhone}` },
        { phone: ` ${cleanPhone}` }
      ]
    });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({ phone: phone.trim(), name });
    } else {
      // Update existing user's name
      user.name = name;
    }
    
    await user.save();
    res.status(200).json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: getProfileImageUrl(req, user.profileImage)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile API
// PUT /api/users/:id
router.put("/:id", upload.single('profileImage'), async (req, res) => {
  const { name } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (req.file) {
      if (user.profileImage) {
        const oldImagePath = user.profileImage.startsWith('/') ? user.profileImage.substring(1) : user.profileImage;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    if (name) {
      user.name = name;
    }
      
    await user.save();
    res.json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: getProfileImageUrl(req, user.profileImage)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;