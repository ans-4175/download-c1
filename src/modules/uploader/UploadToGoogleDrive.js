require("dotenv").config();
const { google } = require("googleapis");
const UploadResult = require("./models/UploadResult");

const secretPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
const auth = new google.auth.GoogleAuth({
  keyFile: secretPath,
  scopes: "https://www.googleapis.com/auth/drive",
});

const client = google.drive({
  version: "v3",
  auth: auth,
});

/**
 *
 * @param {ReadableStream} readableStream
 * @param {string} fileName
 * @param {string} mimeType
 * @returns {Promise<UploadResult>}
 */
const uploadToGDrive = async (
  readableStream,
  fileName,
  mimeType = "image/jpeg"
) => {
  const media = {
    mimeType: mimeType,
    body: readableStream,
  };

  // Search for the file
  let fileId = null;
  let uploadResult = null;
  try {
    const res = await client.files.list({
      q: `name='${fileName}' and '${folderId}' in parents`,
      fields: "files(id, name)",
    });

    if (res.data.files.length > 0) {
      // File exists, update it
      fileId = res.data.files[0].id;
      await driveClient.files.update({
        fileId: fileId,
        media: media,
      });
      uploadResult = UploadResult.success(
        `https://drive.google.com/open?id=${fileId}`,
        fileId
      );
    } else {
      // File doesn't exist, create it
      const file = await driveClient.files.create({
        requestBody: {
          name: fileName,
          mimeType: "image/jpeg",
          parents: [folderId],
        },
        media: media,
      });
      fileId = file.data.id;
      uploadResult = UploadResult.success(
        `https://drive.google.com/open?id=${fileId}`,
        fileId
      );
    }
  } catch (error) {
    console.log(error.response.data.error);
    uploadResult = UploadResult.error(error);
  }

  return uploadResult;
};

module.exports = uploadToGDrive;
