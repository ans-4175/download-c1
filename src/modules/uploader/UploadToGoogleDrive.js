const { google } = require("googleapis");

const { file } = require("googleapis/build/src/apis/file");
const auth = new google.auth.GoogleAuth({
  keyFile: secretPath,
  scopes: "https://www.googleapis.com/auth/drive",
});

const uploadToGDrive = async (
  readableStream,
  fileName,
  mimeType = "image/jpeg"
) => {};
