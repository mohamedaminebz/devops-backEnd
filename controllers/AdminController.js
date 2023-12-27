const Space = require("../models/SpaceModel");
const User = require("../models/User.model");
const Reservation = require("../models/ReservationModel");
const { roles } = require("../utils/roles");

exports.statistic = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: roles.CLIENT });
    const spacesCount = await Space.countDocuments();
    const totalEarningsResult = await Reservation.aggregate([
      {
        $match: {
          paymentStatus: "PENDING", // Consider only paid reservations
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$basket.totalPrice" },
        },
      },
    ]);
    const totalEarnings =
      totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

    const reservationsCount = await Reservation.countDocuments();

    return res.json({
      spacesCount,
      usersCount,
      totalEarnings,
      reservationsCount,
    });
  } catch (error) {
    console.error("Error calculating statistics:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while calculating statistics." });
  }
};
exports.getRecentReservations = async (req, res) => {
  try {
    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
      .limit(5); // Limit the results to 5 reservations

    return res.json(recentReservations);
  } catch (error) {
    console.error("Error fetching recent reservations:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching recent reservations." });
  }
};

exports.weeklySums = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay); // Set to the first day of the week
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (6 - currentDay)); // Set to the last day of the week
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch reservations within the calculated week
    const reservations = await Reservation.find({
      startTime: { $gte: startOfWeek, $lte: endOfWeek }
    });

    // Calculate sums for each day
    const sums = [0, 0, 0, 0, 0, 0, 0];
    reservations.forEach(item => {
      const dayOfWeek = new Date(item.startTime).getDay();
      sums[dayOfWeek] += item.basket.totalPrice;
    });

    res.json({data : sums});
  } catch (error) {
    console.error('Error fetching weekly sums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
