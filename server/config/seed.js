const mongoose = require('mongoose');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
require('./db'); // Ensure DB connection is loaded if run standalone

const seedDB = async () => {
  try {
    console.log('Seeding database roles and permissions...');
    
    // 1. Define standard permissions
    const permissionsData = [
      { name: 'all:manage', description: 'Permission to manage all aspects of the system' },
      { name: 'users:manage', description: 'Permission to read, create, update, and delete users' },
      { name: 'profile:read', description: 'Permission to read own profile details' },
      { name: 'profile:write', description: 'Permission to write/update own profile details' }
    ];

    // Seed permissions
    const seededPermissions = {};
    for (const p of permissionsData) {
      let perm = await Permission.findOne({ name: p.name });
      if (!perm) {
        perm = new Permission(p);
        await perm.save();
      }
      seededPermissions[p.name] = perm._id;
    }
    console.log('✔ Permissions seeded successfully.');

    // 2. Define standard roles with permissions mapping
    const rolesData = [
      {
        name: 'ADMIN',
        description: 'System administrator with full system privileges',
        permissions: Object.values(seededPermissions) // gets all permissions
      },
      {
        name: 'EMPLOYEE',
        description: 'Internal corporate employee with standard management privileges',
        permissions: [
          seededPermissions['users:manage'], 
          seededPermissions['profile:read'], 
          seededPermissions['profile:write']
        ]
      },
      {
        name: 'CUSTOMER',
        description: 'External client or customer with access to basic self-service features',
        permissions: [
          seededPermissions['profile:read'], 
          seededPermissions['profile:write']
        ]
      }
    ];

    // Seed roles
    for (const r of rolesData) {
      let role = await Role.findOne({ name: r.name });
      if (!role) {
        role = new Role(r);
        await role.save();
      } else {
        // Update details if existing to ensure matching mapping
        role.permissions = r.permissions;
        role.description = r.description;
        await role.save();
      }
    }
    console.log('✔ Roles seeded successfully.');
    console.log('Database seeding process completed.');
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
};

// Auto-run if executed directly from terminal
if (require.main === module) {
  seedDB().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}

module.exports = seedDB;
