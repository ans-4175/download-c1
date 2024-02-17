require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const StopWatch = require("./../modules/StopWatch");
const imageDirectory = path.resolve(
  __dirname,
  "..",
  "..",
  process.env.IMAGE_FOLDER
);

// setup S3
const S3Service = require("./../modules/S3Service");
const s3Client = new S3Service(process.env.S3_ENDPOINT, process.env.S3_KEYID, process.env.S3_SECRETKEY);
const bucket = process.env.S3_BUCKET;

// setup GDrive
// const GoogleDriveService = require("./GoogleDrive");
// const servicePath = path.resolve(__dirname, "..", "..", "service-account.json");
// const FOLDER_ID = process.env.GDRIVE_FOLDER_ID;
// const driveService = new GoogleDriveService(servicePath, [
//   "https://www.googleapis.com/auth/drive",
// ]);

const downloadToLocal = (stream, pathToSaveImage) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(pathToSaveImage);
    const image = stream.pipe(fileStream);
    fileStream.on("finish", () => resolve(image));
    fileStream.on("error", reject);
  });
};

/**
 *
 * @param {{code: string, url: string }} obj
 * @returns {Promise<{meta: { province: string, regency: string, district: string, village: string, tps: string }, fileName: string, path: string, driveId: string }>}
 */
const downloadC1 = async (obj) => {
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
    let sw_image = StopWatch.start();
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
          `${sw_image.stop()}`
        );
        try {
          let driveId = null;
          let image = { path: null };
          const sw_upload = StopWatch.start();
          if (isUploadCloud()) {
            // upload to cloud
            const upload = await s3Client.upload(bucket, `tps/${filename}`, { streamFile: response.data });
            driveId = upload.location;
          } else {
            // download to local
            image = await downloadToLocal(response.data, pathToSaveImage);
          }
          console.log(
            "Finish uploading image from",
            url,
            "to",
            driveId || image,
            "in",
            `${sw_upload.stop()}`
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

const flushFolderC1 = async () => {
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

module.exports = { downloadC1, flushFolderC1, isUploadCloud };