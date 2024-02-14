"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("tps_c1_download_result", {
    id: {
      type: "string",
      primaryKey: true,
    },
    provinsiCode: "string",
    kotaKabupatenCode: "string",
    kecamatanCode: "string",
    kelurahanCode: "string",
    tpsCode: "string",
    fileName: { type: "string", notNull: false },
    uri: { type: "string", notNull: false },
    createdAt: { type: "datetime" },
    updatedAt: { type: "datetime" },
  });
};

exports.down = function (db) {
  return db.dropTable("tps_c1_download_result");
};

exports._meta = {
  version: 1,
};
