const GetIncompleteTps = require("../repositories/GetIncompleteTps");

async function testLoadRegion() {
  const list = await GetIncompleteTps(1000,0,['32','12','13']);
  console.log(list);
  console.log(list.length);
}

testLoadRegion();
