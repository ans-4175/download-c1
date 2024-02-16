require("dotenv").config();
const AWS = require("aws-sdk");
const UploadResult = require("./models/UploadResult");

const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.S3_BUCKET;
const accessKey = process.env.S3_KEY;
const accessSecret = process.env.S3_SECRET;

const s3 = new AWS.S3({
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: accessSecret,
  },
});

/**
 *
 * @param {ReadableStream} readableStream
 * @param {string} fileName
 * @returns {Promise<UploadResult>}
 */
const uploadToS3 = async (readableStream, fileName) => {
  const param = {
    Bucket: bucket,
    Key: fileName,
    Body: readableStream,
  };
  return new Promise((resolve, reject) => {
    s3.upload(param, null, (err, data) => {
      if (err) resolve(UploadResult.error(err));
      else resolve(UploadResult.success(data.Location));
    });
  });
};

module.exports = uploadToS3;
