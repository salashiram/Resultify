const Users = require("./users.model");
const UserProfiles = require("./userProfiles.model");

// Asociaciones
Users.hasOne(UserProfiles, { foreignKey: "user_id", as: "UserProfile" });
UserProfiles.belongsTo(Users, { foreignKey: "user_id", as: "User" });

module.exports = {
  Users,
  UserProfiles,
};
