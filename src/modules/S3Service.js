require("dotenv").config();

const fs = require("fs");
const AWS = require("aws-sdk");

class S3Service {
    constructor(endpoint, keyId, keySecret) {
      this.s3 = new AWS.S3({
        endpoint: endpoint,
        credentials: {
          accessKeyId: keyId,
          secretAccessKey: keySecret,
        },
      });
    }
  
    getClient() {
      return this.s3;
    }
  
    async uploadS3 (bucket, uploadPath, { streamFile, pathFile }) {
        return new Promise((resolve) => {
            const params = {
              Bucket: bucket, // pass your bucket name
              Key: uploadPath, //here is your file name
            };
            if (pathFile) {
              params.Body = fs.createReadStream(pathFile);
            } else {
              params.Body = streamFile;
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
    }
}

module.exports = S3Service;