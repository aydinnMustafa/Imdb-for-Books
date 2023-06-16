const { defineAbility } = require("@casl/ability");

const UserAbilities = (user) =>
  defineAbility((can, cannot) => {
    if (user.role === "Admin") {
      can("manage", "all");
    } else if (user.role === "Editor") {
      can("update", "Book");
      can("create", "Book");
      can("update", "User", { _id: user._id });
      cannot("read", "User");
      cannot("delete", "all");
    } else {
      can("read", "Book");
      can("update", "User", { _id: user._id });
      cannot("read", "User");
      cannot("delete", "all");
      cannot("create", "all");
    }
  });

module.exports = UserAbilities;
