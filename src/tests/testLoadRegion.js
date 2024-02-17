const GetIncompleteTps = require("../repositories/GetIncompleteTps");

async function testLoadRegion() {
  const list = await GetIncompleteTps(1000,0,['11','12']);
  console.log(list.length);
}

testLoadRegion();
