const CategoryModel = require("../models/CategoryModel");
const SpaceModel = require("../models/SpaceModel");
const mongoose = require("mongoose");
const UserModel = require("../models/User.model");

const Create = async (req, res) => {
  try {
    let data = req.body;
    if (req.files && req.files.length > 0) {
      const photoPath = req.files[0].path;
    }

    const existSpace = await SpaceModel.findOne({ label: data.label });
    if (existSpace)
      return res.status(409).json({
        message: "Space already exist with that label",
        success: false,
      });
    const existPhone = await SpaceModel.findOne({
      phoneNumber: data.phoneNumber,
    });
    if (existPhone)
      return res.status(409).json({
        message: "Space already exist with that phone number",
        success: false,
      });
    let newCategoryList = [];

    for (let i = 0; i < data.categories.length; i++) {
      const cat = await CategoryModel.findOne({
        label: data.categories[i],
      });
      console.log(cat);
      if (cat && cat._id) {
        newCategoryList.push(cat);
      }
    }
    let photosList = [];
    req.files.forEach((item) => {
      photosList.push(item.path);
    });
    const opHours = [
      {
        day: 1,
        openingTime: "09:00 AM",
        closingTime: "06:00 PM",
        closed: false,
      },
      {
        day: 2,
        openingTime: "09:00 AM",
        closingTime: "06:00 PM",
        closed: false,
      },
      {
        day: 3,
        openingTime: "09:00 AM",
        closingTime: "06:00 PM",
        closed: false,
      },
      {
        day: 4,
        openingTime: "09:00 AM",
        closingTime: "06:00 PM",
        closed: false,
      },
      {
        day: 5,
        openingTime: "09:00 AM",
        closingTime: "06:00 PM",
        closed: false,
      },
      {
        day: 6,
        openingTime: "09:00 AM",
        closingTime: "06:00 PM",
        closed: false,
      },
    ];
    const newSpace = new SpaceModel({
      ...data,
      owner: req.user._id,
      photos: photosList,
      categories: newCategoryList,
      openingHours: opHours,
    });
    await newSpace.save();
    console.log(req.user._id);

    const User = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        space: true,
        spaceID: newSpace._id,
      },
      {
        new: true,
      }
    );
    console.log(User);
    return res.status(200).send({ newSpace, User });
  } catch (error) {
    console.log(error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const Update = async (req, res) => {
  try {
    let data = req.body;
    console.log(data.categories);
    let newCategoryList = [];
    if (data.categories) {
      for (let i = 0; i < data.categories.length; i++) {
        const cat = await CategoryModel.findOne({
          label: data.categories[i],
        });
        if (cat && cat._id) {
          newCategoryList.push(cat);
        }
      }
    }

    const newSpace = await SpaceModel.findByIdAndUpdate(
      req.params._id,
      {
        ...data,
      },
      {
        new: true,
      }
    );

    return res.status(200).send({ newSpace });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const ToggleFavory = async (req, res) => {
  const { userId, spaceId } = req.body;

  try {
    // Find the user by userId
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the spaceId is already in the user's favories
    const isSpaceInFavories = user.favories.some(favSpaceId => favSpaceId == spaceId);

    if (isSpaceInFavories) {
      // Remove spaceId from favories
      user.favories = user.favories.filter(favSpaceId => favSpaceId != spaceId);
    } else {
      // Add spaceId to favories
      user.favories.push(spaceId);
    }

    // Save the updated user
    await user.save();

    return res.json({
      message: "Favorite status toggled successfully",
      favories: user.favories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  ToggleFavory,
};

const fetchMyFavaries = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id).populate('favories');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favories );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user favories', error: error.message });
  }
};

module.exports = { Create, Update ,ToggleFavory,fetchMyFavaries};
