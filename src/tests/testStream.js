require("dotenv").config();

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const rootDirectory = path.resolve(
    __dirname,
    "..",
    ".."
  );
 
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    endpoint: `${process.env.S3_ENDPOINT}`,
    credentials: {
        accessKeyId: process.env.S3_KEYID,
        secretAccessKey: process.env.S3_SECRETKEY,
    },
});

async function testUploadObject() {
    axios({
        url: 'https://sirekap-obj-formc.kpu.go.id/399c/pemilu/ppwp/11/02/01/20/19/1102012019002-20240214-155212--c3945131-20d5-434b-96a0-19b051a97172.jpg',
        method: "GET",
        responseType: "stream",
      })
        .then(async (response) => {
          try {
            const params = {
                Bucket: process.env.S3_BUCKET, // pass your bucket name
                Key: 'test.jpg', //here is your file name
                Body: response.data,
            };

            s3.upload(params, (s3Err, data) => {
                if (s3Err) {
                    console.log({
                        success: false,
                        location: null,
                        error: s3Err,
                    });
                } else {
                    console.log({
                        success: true,
                        location: data.Location,
                    });
                }
            });
          } catch (error) {
           console.error('error', error)     
          }
        });
}
 
testUploadObject();