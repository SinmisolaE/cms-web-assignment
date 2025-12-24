const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['SuperAdmin', 'Manager', 'Contributor', 'Viewer']
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
  description: {
    type: String,
    required: true
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Role', RoleSchema);