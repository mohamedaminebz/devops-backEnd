const GeneratePassword = require("../functions/GeneratePassword");
const { Mail_Sender } = require("../functions/MailSneder");
const PartnershipModel = require("../models/Partnership.model");
const UserModel = require("../models/User.model");
const { roles } = require("../utils/roles");
const bcrypt = require("bcrypt");

const Approve = async (req, res) => {
  try {
    const model = await PartnershipModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!model) {
      return res.status(404).send();
    }
    console.log(model);
    const salt = Number(process.env.SALT);
    const password = GeneratePassword();

    const cryptedMdp = await bcrypt.hash(password.toString(), salt);
    let subject = "Authentication information";
    let content = `
      <div>
      <h2>Welcome ${model.firstName} ${model.lastName} to our plateforme</h2>
      <p>here you will find the informations about new account</p>
      <p>your login is : <b>${model.email}</b> </p>
      <p>your M-D-P is : <b>${password}</b> </p>
      <p>please make sure to change your password after you access to your account</p>
      </div>`;
    await Mail_Sender(model.email, content, subject);

    const newUser = new UserModel({
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email,
      phoneNumber: model.phoneNumber,
      password: cryptedMdp,
      role: roles.COLLABORATOR,
    });
    await newUser.save();

    return res.status(200).send(model);
  } catch (error) {
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const CreatePartnerShip = async (req, res) => {
  try {
    const data = req.body;

    const newPart = new PartnershipModel({
      ...data,
    });
    await newPart.save();
    global.io.emit("newPartnership", { newPart });
    return res.status(200).send({ newPart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

module.exports = { Approve, CreatePartnerShip };
