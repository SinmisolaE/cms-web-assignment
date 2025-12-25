const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [{
    type: String,
    enum: [
      // User permissions
      'create_user', 'edit_user', 'delete_user', 'view_users',
      // Role permissions
      'create_role', 'edit_role', 'delete_role', 'view_roles',
      // Article permissions
      'create_article', 'edit_article', 'delete_article', 'publish_article', 'view_all_articles', 'view_published_only'
    ]
  }],
  description: String,
  isDefault: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Role', RoleSchema);