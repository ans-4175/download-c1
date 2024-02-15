const ResetTpsDownloadInformation = require("../repositories/ResetTpsDownloadInformation");

async function ResetTpsDownload() {
  await ResetTpsDownloadInformation();
}

module.exports = ResetTpsDownload;
