const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require('path');
const rootDirectory = path.resolve(
    __dirname,
    "..",
    ".."
  );
 
const REGION = "your-region"; //e.g. "us-east-1"
const credentials = {
    accessKeyId: process.env.S3_KEYID,
    secretAccessKey: process.env.S3_SECRETKEY,
};

// Create an S3 client
//   const s3 = new S3Client({ region: REGION });
const s3 = new S3Client(credentials);

async function testUploadObject() {
    try {
        const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: "main.js", // File name you want to save as in S3
            Body: fs.createReadStream(path.join(rootDirectory, "main.js")),
        };
      const data = await s3.send(new PutObjectCommand(uploadParams));
      console.log("Success", data);
      return data; // For unit tests
    } catch (err) {
      console.log("Error", err);
      return err; // For unit tests
    }
}
  
  testUploadObject();
