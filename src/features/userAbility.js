import { AbilityBuilder, createMongoAbility } from "@casl/ability";

const buildAbility = (userRole) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  console.log("abilitye gelen", userRole);
  if (userRole === "Admin") {
    can("manage", "all");
  } else if (userRole === "Editor") {
    can("read", "Book");
    can("read", "AdminPanel");
    can("create", "Book");
    can("update", "Book");
    cannot("update", "User");
    cannot("read", "User");
    cannot("create", "User");
    cannot("delete", "all");
  }else{ // user
    can("read", "Book");
    cannot("read", "AdminPanel");
    cannot("read", "User");
    cannot("delete", "all");
    cannot("create", "all");
  }
  return build();
};
export default buildAbility;
