const Reservation = require("../models/ReservationModel");
const Space = require("../models/SpaceModel");
const moment = require("moment");

// exports.confirmReservation = async (req, res) => {
//   const { reservationId } = req.params;

//   try {
//     const reservation = await Reservation.findById(reservationId);
//     if (!reservation) {
//       return res.status(404).json({ message: "Reservation not found" });
//     }

//     reservation.status = "CONFIRMED";
//     await reservation.save();

//     return res.json({ message: "Reservation confirmed successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.toggleReservationStatus = async (req, res) => {
  const { reservationId } = req.params;

  try {
    // Find the reservation by its ID
    const reservation = await Reservation.findById(reservationId);
    console.log("reserv", req.params);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Toggle the reservation status between "CANCELLED" and "CONFIRMED"
    if (reservation.status === "CANCELLED") {
      reservation.status = "CONFIRMED";
    } else {
      reservation.status = "CANCELLED";
    }

    // Save the updated reservation
    await reservation.save();

    return res.json({
      message: "Reservation status toggled successfully",
      newStatus: reservation.status,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getClientReservations = async (req, res) => {
  const clientId = req.user._id;

  try {
    // Find all reservations for the specified user
    const reservations = await Reservation.find({ user: clientId });

    return res.json({ reservations });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSpaceReservations = async (req, res) => {
  try {
    const spaceId = req.params.spaceId;
    console.log(spaceId);
    const reservations = await Reservation.find({ space: spaceId });
    console.log("***");

    return res.json(reservations);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAvailableTimeOnAdate = async (req, res) => {
  const { spaceId, date } = req.body;

  try {
    const space = await Space.findById(spaceId).populate("openingHours");

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    if (!moment(date).isValid()) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const selectedDay = moment(date).day();

    const openingHoursForDay = space.openingHours.find(
      (hours) => hours.day === selectedDay
    );

    if (!openingHoursForDay || !openingHoursForDay.opened) {
      return res.json({ date, timeSlots: [] });
    }

    const openingTime = moment(openingHoursForDay.openingTime, "HH:mm");
    const closingTime = moment(openingHoursForDay.closingTime, "HH:mm");

    const reservations = await Reservation.find({
      space: spaceId,
      startTime: { $gte: new Date(date) },
    });

    const occupiedTimeSlots = new Set();
    reservations.forEach((reservation) => {
      const startTime = moment(reservation.startTime).utc();
      const endTime = moment(reservation.endTime).utc();

      while (startTime.isBefore(endTime)) {
        occupiedTimeSlots.add(startTime.format("HH:mm"));
        startTime.add(30, "minutes");
      }
    });

    const timeSlots = [];
    const currentTime = openingTime.clone();

    while (currentTime.isBefore(closingTime)) {
      const timeSlot = currentTime.format("HH:mm");

      if (!occupiedTimeSlots.has(timeSlot)) {
        timeSlots.push(timeSlot);
      }

      currentTime.add(30, "minutes");
    }

    return res.json({ date, timeSlots });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch available time slots" });
  }
};





exports.Create = async (req, res) => {
  try {
    const data = req.body;
    console.log(data.startTime);

    const { year, month, day, hours, min } = data.startTime;

    const datee = new Date(year, month, day, hours + 1, min);

    // Check if the date is valid before proceeding
    if (isNaN(datee)) {
      console.log("Invalid Date:", data);
    } else {
      console.log("Valid Date:", datee);
    }
    const existReser = await Reservation.findOne({
      space: req.params._id,
      user: req.user._id,
      startTime: datee,
    });

    if (existReser)
      return res.status(409).json({
        message: "Reservation already exist ",
        success: false,
      });

    let totalDuration = 0;
    let totalPrices = 0;
    data.services.forEach((element) => {
      totalDuration += element.duration;
      totalPrices += element.price;
    });
    const endTimee = new Date(datee);

    console.log(totalDuration);
    endTimee.setMinutes(datee.getMinutes() + totalDuration);
    console.log("end Time:", endTimee.toISOString()); // Format end time as ISO string
    console.log("starts Time", datee);

    const newReservation = new Reservation({
      ...data,
      startTime: datee.toISOString(),
      endTime: endTimee.toISOString(),
      user: req.user._id,
      space: req.params._id,
      basket: { services: data.services, totalPrice: totalPrices },
    });
    await newReservation.save();

    return res.status(200).send({ newReservation });
  } catch (error) {
    console.log(error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};
