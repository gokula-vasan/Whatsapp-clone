import express from "express";
import User from "../models/User.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Get user by Phone api
// GET api/users/:phone
router.get("/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    // 1. FIXED: Always run the null-guard first before checking properties!
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. FIXED: Corrected spelling to user.profileImage (added missing 't')
    // Also cleaned up string interpolation formatting spaces
    const profileImageUrl = user.profileImage 
      ? `${req.protocol}://${req.get('host')}${user.profileImage}`
      : null;

    // 3. FIXED: Removed the second duplicate res.json(user) call below this
    res.json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      profileImage: profileImageUrl
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create User with image upload API
// POST api/users/
router.post("/", upload.single("profileImage"), async (req, res) => {
  const { phone, name } = req.body;

  try {
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    
    user = new User({ phone, name, profileImage });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Setup User Profile - Update name for existing user
// POST api/users/setup
router.post("/setup", async (req, res) => {
  const { phone, name } = req.body;

  try {
    if (!phone || !name) {
      return res.status(400).json({ message: "Phone and name are required" });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      // Create new user if doesn't exist
      user = new User({ phone, name });
    } else {
      // Update existing user's name
      user.name = name;
    }
    
    await user.save();
    res.status(200).json(user);
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
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;