// rejectedReasonSeeder.js

const { RejectedReason } = require("../models"); // Adjust the path as per your project structure

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed data for the RejectedReason model
    const seedData = [
      // Parent reasons
      { name: "VENDOR CONTROL" },
      { name: "DETAILING" },
      { name: "FITTING" },
      { name: "WELDING" },
      { name: "COATINGS" },
    ];

    // Use Sequelize's bulkCreate method to add data to the database
    const createdParents = await RejectedReason.bulkCreate(seedData, {
      individualHooks: true,
    });

    // Save children with the corresponding parentId
    const childrenSeedData = [
      // VENDOR CONTROL children
      { name: "Misc", parentId: createdParents[0].id },
      { name: "Late Delivery", parentId: createdParents[0].id },
      { name: "No MTR/CoC", parentId: createdParents[0].id },
      { name: "Wrong Material", parentId: createdParents[0].id },
      { name: "Defective Material", parentId: createdParents[0].id },
      { name: "No ID", parentId: createdParents[0].id },
      { name: "Wrong Heat #", parentId: createdParents[0].id },
      { name: "No or Wrong CVN's", parentId: createdParents[0].id },
      { name: "Wrong Spec/Grade", parentId: createdParents[0].id },
      { name: "Damage", parentId: createdParents[0].id },
      { name: "Foreign Material", parentId: createdParents[0].id },

      // DETAILING children
      { name: "None", parentId: createdParents[1].id },
      { name: "Missed Dim", parentId: createdParents[1].id },
      { name: "Wrong Dim", parentId: createdParents[1].id },
      { name: "No weld symbol", parentId: createdParents[1].id },
      { name: "Wrong weld symbol", parentId: createdParents[1].id },
      { name: "Insufficient information", parentId: createdParents[1].id },
      { name: "Wrong Material", parentId: createdParents[1].id },
      { name: "Drawings not checked", parentId: createdParents[1].id },
      { name: "Interference of parts", parentId: createdParents[1].id },
      { name: "Missing Parts", parentId: createdParents[1].id },
      { name: "Misc. error", parentId: createdParents[1].id },

      // FITTING children
      { name: "Wrong Dimension", parentId: createdParents[2].id },
      { name: "Mislocated Holes", parentId: createdParents[2].id },
      { name: "Wrong Size Hole", parentId: createdParents[2].id },
      { name: "Wrong Detail", parentId: createdParents[2].id },
      { name: "Too Long", parentId: createdParents[2].id },
      { name: "Too Short", parentId: createdParents[2].id },
      { name: "Bad Cope", parentId: createdParents[2].id },
      { name: "Cope Wrong Side", parentId: createdParents[2].id },
      { name: "Wrong Material", parentId: createdParents[2].id },
      { name: "Improper Weld Prep", parentId: createdParents[2].id },
      { name: "Misc", parentId: createdParents[2].id },

      // WELDING children
      { name: "Wrong Process", parentId: createdParents[3].id },
      { name: "Cracks", parentId: createdParents[3].id },
      { name: "Incomplete Penetration", parentId: createdParents[3].id },
      { name: "Lack of Fusion", parentId: createdParents[3].id },
      { name: "Lack of Penetration", parentId: createdParents[3].id },
      { name: "Overwelding", parentId: createdParents[3].id },
      { name: "Porosity", parentId: createdParents[3].id },
      { name: "Undercut", parentId: createdParents[3].id },
      { name: "UT Defect", parentId: createdParents[3].id },
      { name: "RT Defect", parentId: createdParents[3].id },
      { name: "Wrong Consumable", parentId: createdParents[3].id },

      // COATINGS children
      { name: "Wrong Color", parentId: createdParents[4].id },
      { name: "Mud Cracking", parentId: createdParents[4].id },
      { name: "Orange Peel", parentId: createdParents[4].id },
      { name: "Lack of Adhesion", parentId: createdParents[4].id },
      { name: "Runs/Sags", parentId: createdParents[4].id },
      { name: "Wrong Coating", parentId: createdParents[4].id },
      { name: "Insufficient DFT", parentId: createdParents[4].id },
      { name: "Insufficient Blast Profile", parentId: createdParents[4].id },
      { name: "Contamination", parentId: createdParents[4].id },
      { name: "Blistering", parentId: createdParents[4].id },
      { name: "Dry Spray", parentId: createdParents[4].id },
    ];

    await RejectedReason.bulkCreate(childrenSeedData, {
      individualHooks: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all data seeded by the 'up' method
    await RejectedReason.destroy({ where: {} });
  },
};
