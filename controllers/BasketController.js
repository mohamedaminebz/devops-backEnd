const {BasketModel} = require("../models/ReservationBasketModel")




exports.getBasketByOwner = async (req, res) => {
  const ownerId = req.user._id

  try {
    const basket = await BasketModel.findOne({ owner: ownerId }).populate("service");

    if (!basket) {
  
      return res.status(404).json({ message: "Basket not found for the owner" });
    }
    return res.json({ basket });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.addServiceToBasket = async (req, res) => {
    const ownerId = req.user._id;
    const serviceId = req.body.serviceId;
  
    try {
      const basket = await BasketModel.findOne({ owner: ownerId });
  
      if (!basket) {
        return res.status(404).json({ message: "Basket not found for the owner" });
      }
  
      // Push the serviceId to the service array in the basket
      basket.service.push(serviceId);
  
      // Save the updated basket to the database
      const updatedBasket = await basket.save();
  
      return res.json({ basket: updatedBasket });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
exports.removeServiceFromBasket = async (req, res) => {
  const ownerId = req.user._id;
  const serviceId = req.params.serviceId;

  try {
    const basket = await BasketModel.findOne({ owner: ownerId });

    if (!basket) {
      return res.status(404).json({ message: "Basket not found for the owner" });
    }

    // Find the index of the serviceId in the service array
    const index = basket.service.indexOf(serviceId);

    if (index === -1) {
      return res.status(404).json({ message: "Service not found in the basket" });
    }

    // Remove the serviceId from the service array using splice
    basket.service.splice(index, 1);

    // Save the updated basket to the database
    const updatedBasket = await basket.save();

    return res.json({ basket: updatedBasket });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

