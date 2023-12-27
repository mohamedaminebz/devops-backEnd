const Category = require("../models/CategoryModel"); 
const Space = require("../models/SpaceModel");

exports.getActiveCategoriesWithSubcategories = async (req, res) => {
  try {
    // Find all active categories
    const activeCategories = await Category.find({ status: "ACTIVE" });

    // Filter out inactive subcategories and get only active subcategories for each category
    const activeCategoriesWithSubcategories = activeCategories.map((category) => {
      const activeSubcategories = category.subCategory.filter(
        (subCategory) => subCategory.status === "ACTIVE"
      );
      return {
        _id: category._id,
        label: category.label,
        subCategory: activeSubcategories,
      };
    });

    return res.json(activeCategoriesWithSubcategories );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};



exports.fetchActiveSubCategoriesForSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId).populate("categories");

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // Filter the active categories
    const activeCategories = space.categories.filter(
      (category) => category.status === "ACTIVE"
    );

    // Fetch all active subcategories belonging to the active categories
    const activeSubCategories = activeCategories.flatMap((category) =>
      category.subCategory.filter((subCategory) => subCategory.status === "ACTIVE")
    );

    // Extract the label field from the subcategories
    const subCategoryLabels = activeSubCategories.map((subCategory) => subCategory.label);

    // Send the response back to the client
    res.json(subCategoryLabels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active subcategories" });
  }
};
