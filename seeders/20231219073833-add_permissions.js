"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const permissionsData = [
      {
        name: "View jobs",
        slug: "view_job",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View tasks",
        slug: "view_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Self-assign a task",
        slug: "self_assign_a_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View dashboard with graphs",
        slug: "view_dashboard_with_graphs",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View inventory",
        slug: "view_inventory",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View inventory detail",
        slug: "view_inventory_detail",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add inventory",
        slug: "add_inventory",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View rejected tasks",
        slug: "view_rejected_tasks",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add CAR",
        slug: "add_car",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View CAR",
        slug: "view_car",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Approved CAR",
        slug: "approved_car",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Share CAR",
        slug: "share_car",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View past CARs",
        slug: "view_past_cars",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View profile",
        slug: "view_profile",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Profile",
        slug: "edit_profile",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View notifications",
        slug: "view_notifications",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Collaborate on Microsoft Whiteboard",
        slug: "collaborate_on_microsoft_whiteboard",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Export tasks in PDF",
        slug: "export_tasks_in_pdf",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Approved task",
        slug: "approved_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add job",
        slug: "add_job",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Export jobs",
        slug: "export_job",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Job",
        slug: "edit_job",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Job",
        slug: "delete_job",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Task",
        slug: "add_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Task",
        slug: "edit_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Task",
        slug: "delete_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Export tasks",
        slug: "export_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Inventory",
        slug: "edit_inventory",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Inventory",
        slug: "delete_inventory",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Export Inventory",
        slug: "export_inventory",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add User",
        slug: "add_user",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View User",
        slug: "view_user",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit User",
        slug: "edit_user",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete User",
        slug: "delete_user",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Export User",
        slug: "export_user",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Role",
        slug: "add_role",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View Roles",
        slug: "view_role",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Role",
        slug: "edit_role",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete role",
        slug: "delete_role",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Export Roles",
        slug: "export_role",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Permission",
        slug: "add_permision",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View Permissions",
        slug: "view_permision",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Permission",
        slug: "edit_permision",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Permission",
        slug: "delete_permision",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Export Permissions",
        slug: "export_permision",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rejected CAR",
        slug: "rejected_car",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rejected Task",
        slug: "rejected_task",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Review tasks",
        slug: "review_tasks",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View Contact",
        slug: "view_contact",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Contact",
        slug: "add_contact",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Contact",
        slug: "delete_contact",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Contact",
        slug: "edit_contact",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Purchase",
        slug: "add_purchase",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Purchase",
        slug: "edit_purchase",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Purchase",
        slug: "delete_purchase",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View Purchase Details",
        slug: "view_purchasedetails",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add PurchaseOrder Item",
        slug: "add_purchase_item",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Company",
        slug: "add_company",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Company",
        slug: "edit_company",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Company",
        slug: "delete_company",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // { name: "Add Vendor", slug: "add_vendor", isActive: 1 },
      // { name: "Edit Vendor", slug: "edit_vendor", isActive: 1 },
      // { name: "Delete Vendor", slug: "delete_vendor", isActive: 1 },
      {
        name: "Detail Job",
        slug: "detail_job",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Fabricated Items",
        slug: "add_fabricated_items",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Update Fabricated Items",
        slug: "update_fabricated_items",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Add Sequence",
        slug: "add_sequence",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delete Sequence",
        slug: "delete_sequence",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View Sequence",
        slug: "view_sequence",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Edit Sequence",
        slug: "edit_sequence",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Download Diagram",
        slug: "download_diagram",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Make Call",
        slug: "make_call",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "View Task Detail",
        slug: "view_task_detail",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("permissions", permissionsData, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
