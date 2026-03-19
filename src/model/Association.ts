import database from "../config/DatabaseConfig";
import path from "path";
import fs from "fs";

export default function registerAssociations() {
  const modelsPath = path.join(__dirname);

  const models: Record<string, any> = {};

  // Load all models dynamically
  fs.readdirSync(modelsPath)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        (file.endsWith(".ts") || file.endsWith(".js")) &&
        !file.includes("Association")
    )
    .forEach((file) => {
      const modelModule = require(path.join(modelsPath, file));
      const model = modelModule.default || modelModule;
      if (model && model.init) models[model.name] = model;
    });

  // ----------------------
  // Relationships
  // ----------------------

  // User ↔ Address
  if (models.User && models.Address) {
    models.User.hasMany(models.Address, {
      foreignKey: "userId",
      sourceKey: "externalId",
      as: "addresses",
    });
    models.Address.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "externalId",
      as: "user",
    });
  }

  // User ↔ UserSubscription
  if (models.User && models.UserSubscription) {
    models.User.hasMany(models.UserSubscription, {
      foreignKey: "userId",
      sourceKey: "externalId",
      as: "subscriptions",
    });
    models.UserSubscription.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "externalId",
      as: "user",
    });
  }


  // User ↔ UserRole
if (models.User && models.UserRole) {
  models.User.hasMany(models.UserRole, {
    foreignKey: "userId",
    sourceKey: "externalId",
    as: "userRoles",
  });

  models.UserRole.belongsTo(models.User, {
    foreignKey: "userId",
    targetKey: "externalId",
    as: "user",
  });
}

// Role ↔ UserRole
if (models.Role && models.UserRole) {
  models.Role.hasMany(models.UserRole, {
    foreignKey: "roleId",
    sourceKey: "externalId",
    as: "userRoles",
  });

  models.UserRole.belongsTo(models.Role, {
    foreignKey: "roleId",
    targetKey: "externalId",
    as: "role",
  });
}

  // User ↔ WasteRequest
  if (models.User && models.WasteRequest) {
    models.User.hasMany(models.WasteRequest, {
      foreignKey: "userId",
      sourceKey: "externalId",
      as: "wasteRequests",
    });
    models.WasteRequest.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "externalId",
      as: "user",
    });
  }

  // WasteRequest ↔ RequestAssignment
  if (models.WasteRequest && models.RequestAssignment) {
    models.WasteRequest.hasMany(models.RequestAssignment, {
      foreignKey: "wasteRequestId",
      sourceKey: "externalId",
      as: "assignments",
    });
    models.RequestAssignment.belongsTo(models.WasteRequest, {
      foreignKey: "wasteRequestId",
      targetKey: "externalId",
      as: "wasteRequest",
    });
  }

  // WasteRequest ↔ RequestImage
  if (models.WasteRequest && models.RequestImage) {
    models.WasteRequest.hasMany(models.RequestImage, {
      foreignKey: "wasteRequestId",
      sourceKey: "externalId",
      as: "images",
    });
    models.RequestImage.belongsTo(models.WasteRequest, {
      foreignKey: "wasteRequestId",
      targetKey: "externalId",
      as: "wasteRequest",
    });
  }



  console.log(`[ecowaste.Association] All associations registered successfully.`);
}
