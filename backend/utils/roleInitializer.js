const Role = require('../models/Role');

// Define our 4 default roles with their permissions
const defaultRoles = [
  {
    name: 'SuperAdmin',
    description: 'Has full access to all features',
    permissions: [
      'create_article', 'edit_article', 'delete_article', 'publish_article', 'view_all_articles', 'view_published_only',
      'create_user', 'edit_user', 'delete_user', 'view_users',
      'create_role', 'edit_role', 'delete_role', 'view_roles'
    ],
    isDefault: true
  },
  {
    name: 'Manager',
    description: 'Can manage articles and moderate content',
    permissions: [
      'create_article', 'edit_article', 'delete_article', 'publish_article', 'view_all_articles', 'view_published_only',
      'view_users',
      'view_roles'
    ],
    isDefault: true
  },
  {
    name: 'Contributor',
    description: 'Can create and edit own articles',
    permissions: [
      'create_article', 'edit_article', 'view_all_articles', 'view_published_only'
    ],
    isDefault: true
  },
  {
    name: 'Viewer',
    description: 'Can only view published articles',
    permissions: [
      'view_published_only'
    ],
    isDefault: true
  }
];

// This function runs when server starts
async function initializeRoles() {
  try {    
    // Count how many roles are in database
    const roleCount = await Role.countDocuments();
    
    // If database is empty (first time running)
    if (roleCount === 0) {
      console.log('No roles found. Creating default roles...');
      
      // Insert all 4 default roles at once
      await Role.insertMany(defaultRoles);
      
      console.log('Default roles created successfully!');

    } else {
      console.log('Roles already exist in database');
    }
    
  } catch (error) {
    console.error('Error creating roles:', error.message);
  }
}

module.exports = { initializeRoles };