require("dotenv").config();

const path = require("path");
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    endpoint: `${process.env.S3_ENDPOINT}/tps`,
    credentials: {
        accessKeyId: process.env.S3_KEYID,
        secretAccessKey: process.env.S3_SECRETKEY,
    },
});

async function testReadObject() {
    try {
        // https://is3.cloudhost.id/pil-c1/tps/3171011002033.jpg
        // https://is3.cloudhost.id/pil-c1/tps/[tps_code].jpg
        const params = { Bucket: process.env.S3_BUCKET, Key: '3171011002033.jpg' };
        const file = require('fs').createWriteStream(path.resolve(
            __dirname,
            "..",
            "..",
            'file.jpg'
          ));
        s3.getObject(params).createReadStream().pipe(file);
        return true; // For unit tests
    } catch (err) {
        console.log("Error", err);
        return err; // For unit tests
    }
}
  
testReadObject();