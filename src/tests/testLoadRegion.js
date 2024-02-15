const GetIncompleteTps = require("../repositories/GetIncompleteTps");

async function testLoadRegion() {
  const list = await GetIncompleteTps(10);
  console.log(list);
}

testLoadRegion();
