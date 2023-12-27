const Service = require("../models/ServiceModel"); 
const Space = require("../models/SpaceModel"); 

exports.fetchServicesBySpace = async (req, res) => {
    const spaceId = req.params.spaceId;
    console.log("spaceId",spaceId);
  
    try {
      
      const services = await Service.find({ space: spaceId });
  
      return res.json({ services });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  exports.makePromotion = async (req, res) => {
    const { serviceId, pricePromo } = req.body;
  
    try {
      // Find the service by _id (serviceId)
      const service = await Service.findById(serviceId);
  
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      // Update the service with the promo details
      service.promo = true;
      service.pricePromo = pricePromo;
  
      // Save the updated service
      await service.save();
  
      return res.json({ message: "Promotion updated successfully", service });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update promotion" });
    }
  };

  exports.resetPrice = async (req, res) => {
    const { serviceId } = req.body;
  
    try {
      // Find the service by _id (serviceId)
      const service = await Service.findById(serviceId);
  
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      // Reset the pricePromo and promo fields
      service.promo = false;
      service.pricePromo = 0;
  
      // Save the updated service
      await service.save();
  
      return res.json({ message: "Price reset successfully", service });
    } catch (error) {
      return res.status(500).json({ message: "Failed to reset price" });
    }
  };

  exports.fetchServicesWithSpace = async (req, res) => {
    const categoryFromParams = req.params.category;
  
    try {
      // Find all the spaces
      const spaces = await Space.find();
  
      // Create an array to hold the result
      const result = [];
  
      // Loop through each space to find services that match the provided category
      for (const space of spaces) {
        const services = await Service.find({
          Category: categoryFromParams,
          space: space._id, // Match services with the current space's _id
        });
  
        // Create an object with the space and its associated services
        if (services.length!=0 ) {

          const spaceWithServices = {
            space: space,
            services: services,
          };
    
          // Push the object to the result array
          result.push(spaceWithServices);
        }
      }
  
      return res.json(result);
    } catch (error) {
      console.error('Error fetching services with space:', error);
      return res.status(500).json(error);
    }
  };
  