require("dotenv").config();

const axios = require('axios');
const S3Service = require("./../modules/S3Service");
const s3Client = new S3Service(process.env.S3_ENDPOINT, process.env.S3_KEYID, process.env.S3_SECRETKEY);
const bucket = process.env.S3_BUCKET;

async function testStream() {
    axios({
        url: 'https://sirekap-obj-formc.kpu.go.id/399c/pemilu/ppwp/11/02/01/20/19/1102012019002-20240214-155212--c3945131-20d5-434b-96a0-19b051a97172.jpg',
        method: "GET",
        responseType: "stream",
      })
        .then(async (response) => {
          try {
            const upload = await s3Client.upload(bucket, `test.jpg`, { streamFile: response.data });
            console.log(upload);
          } catch (error) {
           console.error('error', error)     
          }
        });
}
 
testStream();