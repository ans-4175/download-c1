const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { google } = require("googleapis");
const { file } = require("googleapis/build/src/apis/file");
const servicePath = path.resolve(__dirname, "..", "..", "service-account.json");
const FOLDER_ID = "1JGpDUdK09fwCSRKhcDROITTwNlTghGgM"; // FIXME: make this configurable same as service-account

class GoogleDriveService {
  constructor(secretPath, scopes) {
    const auth = new google.auth.GoogleAuth({
      keyFile: secretPath,
      scopes,
    });

    this.driveClient = google.drive({
      version: "v3",
      auth: auth,
    });
  }

  getClient() {
    return this.driveClient;
  }
}
const driveClient = new GoogleDriveService(servicePath, [
  "https://www.googleapis.com/auth/drive",
]).getClient();

const checkFile = async (fileName) => {
  const res = await driveClient.files.list({
    q: `name='${fileName}' and '${FOLDER_ID}' in parents`,
    fields: "files(id, name)",
  });

  return res.data.files.length > 0;
};

const downloadImage = (response, pathToSaveImage) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(pathToSaveImage);
    const image = response.data.pipe(fileStream);
    fileStream.on("finish", () => resolve(image));
    fileStream.on("error", reject);
  });
};

const uploadImage = async (response, pathToSaveImage, fileName) => {
  const media = {
    mimeType: "image/jpeg",
    body: fs.createReadStream(pathToSaveImage),
  };

  // Search for the file
  let fileId = null;
  try {
    const res = await driveClient.files.list({
      q: `name='${fileName}' and '${FOLDER_ID}' in parents`,
      fields: "files(id, name)",
    });

    if (res.data.files.length > 0) {
      // File exists, update it
      fileId = res.data.files[0].id;
      await driveClient.files.update({
        fileId: fileId,
        media: media,
      });
    } else {
      // File doesn't exist, create it
      const file = await driveClient.files.create({
        requestBody: {
          name: fileName,
          mimeType: "image/jpeg",
          parents: [FOLDER_ID],
        },
        media: {
          mimeType: "image/jpeg",
          body: fs.createReadStream(pathToSaveImage),
        },
      });
      fileId = file.data.id;
    }
  } catch (error) {
    console.log(error.response.data.error);
  }

  return fileId;
};

/**
 *
 * @param {{code: string, url: string }} obj
 * @returns {Promise<{meta: { province: string, regency: string, district: string, village: string, tps: string }, fileName: string, path: string, driveId: string }>}
 */
const downloadTpsC1 = async (obj) => {
  const { code: tp, url } = obj;
  console.log(obj);
  return new Promise((resolve, reject) => {
    if (!url) return resolve(null);

    const province = tp.substring(0, 2);
    const regency = tp.substring(0, 4);
    const district = tp.substring(0, 6);
    const village = tp.substring(0, 10);
    const filename = `${tp}.jpg`;
    // const filename = `${province}_${regency}_${district}_${village}_${tp}.jpg`;
    const pathToSaveImage = path.resolve(
      __dirname,
      "..",
      "..",
      "image-c1",
      filename
    );

    // if (checkFile(filename)) return resolve({ meta: { province, regency, district, village, tps: tp }, filename, path: pathToSaveImage, driveId: null });
    axios({
      url,
      method: "GET",
      responseType: "stream",
    })
      .then(async (response) => {
        try {
          const image = await downloadImage(response, pathToSaveImage);
          let driveId = null;
          if (fs.existsSync(servicePath)) {
            //test if service account exist
            driveId = await uploadImage(response, pathToSaveImage, filename);
          }
          return resolve({
            meta: { province, regency, district, village, tps: tp },
            filename,
            path: image.path,
            driveId,
          });
        } catch (error) {
          reject(null);
        }
      })
      .catch((error) => {
        reject(null);
      });
  });
};

module.exports = { downloadTpsC1 };
