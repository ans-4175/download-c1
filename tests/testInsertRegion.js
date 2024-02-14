const { isReady } = require("../src/modules/db");
const InsertRegion = require("../src/repositories/InsertRegion");

async function TestInsertRegion() {
  await InsertRegion("1", "2", "3", "4", "5");
  const db = await isReady;
  const list = await db.all("SELECT * FROM tps_c1_download_result");
  console.log(list);
}

TestInsertRegion();
