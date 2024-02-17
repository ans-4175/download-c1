require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const imageDirectory = path.resolve(
  __dirname,
  "..",
  "..",
  process.env.IMAGE_FOLDER
);

const { google } = require("googleapis");
const { file } = require("googleapis/build/src/apis/file");
const servicePath = path.resolve(__dirname, "..", "..", "service-account.json");
const FOLDER_ID = process.env.GDRIVE_FOLDER_ID;

const AWS = require("aws-sdk");
const StopWatch = require("./StopWatch");
const s3 = new AWS.S3({
  endpoint: `${process.env.S3_ENDPOINT}/tps`,
  credentials: {
    accessKeyId: process.env.S3_KEYID,
    secretAccessKey: process.env.S3_SECRETKEY,
  },
});

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

const uploadImageS3 = async (response, fileName, pathToSaveImage) => {
  return new Promise((resolve) => {
    const params = {
      Bucket: process.env.S3_BUCKET, // pass your bucket name
      Key: fileName, //here is your file name
    };
    if (pathToSaveImage) {
      params.Body = fs.createReadStream(pathToSaveImage);
    } else {
      params.Body = response.data;
    }

    s3.upload(params, (s3Err, data) => {
      if (s3Err) {
        resolve({
          success: false,
          location: null,
          error: s3Err,
        });
      } else {
        resolve({
          success: true,
          location: data.Location,
        });
      }
    });
  });
};
const uploadImageDrive = async (response, pathToSaveImage, fileName) => {
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
    const pathToSaveImage = path.join(imageDirectory, filename);

    // if (checkFile(filename)) return resolve({ meta: { province, regency, district, village, tps: tp }, filename, path: pathToSaveImage, driveId: null });
    let start = StopWatch.start();
    axios({
      url,
      method: "GET",
      responseType: "stream",
    })
      .then(async (response) => {
        console.log(
          "Finish downloading image from",
          url,
          "in",
          `${start.stop()}`
        );
        try {
          let driveId = null;
          let image = { path: null };
          const start2 = StopWatch.start();
          if (isUploadCloud()) {
            // upload to cloud
            const upload = await uploadImageS3(response, filename);
            driveId = upload.location;
          } else {
            // download to local
            image = await downloadImage(response, pathToSaveImage);
          }
          console.log(
            "Finish uploading image from",
            url,
            "to",
            driveId || image,
            "in",
            `${start2.stop()}`
          );
          return resolve({
            meta: { province, regency, district, village, tps: tp },
            fileName: filename,
            path: image.path,
            driveId,
          });
        } catch (error) {
          reject(null);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const flushFolderImageC1 = async () => {
  // Read the directory
  const files = await fs.readdirSync(imageDirectory);
  // Delete each file
  for (const file of files) {
    if (file === ".gitkeep") continue;
    await fs.unlinkSync(path.join(imageDirectory, file));
  }
};

const isUploadCloud = async () => {
  return process.env.S3_SECRETKEY && process.env.S3_SECRETKEY.trim() !== "";
  // return fs.existsSync(servicePath) || (process.env.S3_SECRETKEY && process.env.S3_SECRETKEY.trim() !== '');
};

module.exports = { downloadTpsC1, flushFolderImageC1, isUploadCloud };
