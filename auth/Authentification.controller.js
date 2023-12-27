const GenereteToken = require("../functions/GenerateToken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { roles } = require("../utils/roles");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Please verify your email",
        success: false,
      });
    }

    const passMatch = await bcrypt.compare(password, user?.password);
    if (!passMatch) {
      return res.status(400).json({
        message: "Please verify your password",
        success: false,
      });
    }

    const token = GenereteToken.AccessToken({ _id: user._id }, "3000s");
    const refreshToken = GenereteToken.RefreshToken({ _id: user._id }, "3000h");

    return res.status(200).json({
      message: "Logged successfully",
      success: true,
      data: user,
      token,
      refreshToken,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const Register = async (req, res) => {
  try {
    let data = req.body;
    console.log(roles.COLLABORATOR);
    const existUser = await UserModel.findOne({
      data,
    });
    if (existUser)
      return res.status(409).json({
        Message: "user already exists with that email",
        Success: false,
      });

    const salt = Number(process.env.SALT);
    const cryptedMdp = await bcrypt.hash(data.password.toString(), salt);

    const newUser = new UserModel({
      ...data,
      password: cryptedMdp,
    });
    const createdUser = await newUser.save();
    console.log(newUser._id);
    const token = GenereteToken.AccessToken({ _id: newUser._id }, "3600s");
    const refreshToken = GenereteToken.RefreshToken(
      { _id: newUser._id },
      "3000h"
    );

    return res.status(200).json({
      Message: "user created suucessfully",
      Success: true,
      data: createdUser,
      token,
      refreshToken,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const GetUserByToken = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const RefreshToken = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(302).json({ success: false, message: "no auth" });
  }
  const refreshToken = req.headers.authorization.replace("Bearer", "").trim();
  if (!refreshToken) {
    return res.status(403).json({ error: "Access denied,token missing!" });
  } else {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ err: "RefreshToken expired ! " });
      }

      delete user.iat;
      delete user.exp;
      const accessToken = GenereteToken.AccessToken(user, "3600s");
      res.send({
        token: accessToken,
      });
    });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const _id = req.user._id;
    const { password, oldpassword } = req.body;
    console.log(password);

    const passMatch = await bcrypt.compare(oldpassword, req.user.password);
    if (!passMatch) {
      return res.status(400).json({
        Message: "old password is not correct",
        Success: false,
      });
    }

    const salt = process.env.SALT;
    const cryptedMdp = await bcrypt.hash(password, Number(salt));

    const updateUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          password: cryptedMdp,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }
    return res
      .status(200)
      .json({ Message: "updated successfully", data: updateUser });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      return res.status(400).json({
        Message: "there's no user with that email",
        Success: false,
      });
    }

    const password = GeneratePassword();
    const salt = process.env.SALT;
    const cryptedMdp = await bcrypt.hash(password, Number(salt));

    const updateUser = await UserModel.findOneAndUpdate(
      { _id: existUser._id },
      {
        $set: {
          password: cryptedMdp,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }

    // SENDING THE LOGIN AND PASSWORD TO USER WITH MAIL
    let subject = "Password Recover";
    let content = `
          <div>
          <h2>Welcome ${existUser.nom} ${existUser.prenom} to our plateforme</h2>
          <p>we recieved a request to recover your password</p>
          <p>your new password is : <b>${password}</b> </p>
          <p>please make sure to change your password after you access to your account</p>
          </div>`;
    await Mailer.Mail_Sender(existUser.email, content, subject);

    return res
      .status(200)
      .json({ Message: "new password sent to your mail box" });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const UpdateGeneralInfos = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log(req.body);
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }
    return res.status(200).json({ Message: "User updated", data: updatedUser });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

module.exports = {
  Login,
  Register,
  GetUserByToken,
  RefreshToken,
  ChangePassword,
  UpdateGeneralInfos,
};
