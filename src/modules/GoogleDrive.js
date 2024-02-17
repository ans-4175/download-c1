const { google } = require("googleapis");
const { file } = require("googleapis/build/src/apis/file");

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

    async uploadImageDrive({ fileName, folderId }, { streamFile, pathFile }) {
        const media = {
            mimeType: "image/jpeg",
        };
        if (pathFile) {
            media.body = fs.createReadStream(pathFile);
        } else {
            media.body = streamFile;
        }
    
        // Search for the file
        let fileId = null;
        try {
            const res = await this.driveClient.files.list({
                q: `name='${fileName}' and '${FOLDER_ID}' in parents`,
                fields: "files(id, name)",
            });
        
            if (res.data.files.length > 0) {
                // File exists, update it
                fileId = res.data.files[0].id;
                await this.driveClient.files.update({
                    fileId: fileId,
                    media: media,
                });
            } else {
                // File doesn't exist, create it
                const file = await this.driveClient.files.create({
                    requestBody: {
                        name: fileName,
                        mimeType: "image/jpeg",
                        parents: [FOLDER_ID],
                    },
                    media: media,
                });
                fileId = file.data.id;
            }
        } catch (error) {
            console.log(error.response.data.error);
        }
    
        return fileId;
    }
}

module.exports = GoogleDriveService