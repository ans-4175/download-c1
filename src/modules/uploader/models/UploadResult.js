class UploadResult {
  /**
   *
   * @param {Error} err
   * @param {string} remoteUri
   * @param {string} fileId
   */
  constructor(err = null, remoteUri = null, fileId = null) {
    /**
     * @public
     */
    this.error = err;
    /**
     * @public
     */
    this.remoteUri = remoteUri;
    /**
     * @public
     */
    this.fileId = fileId;
  }
}

module.exports = UploadResult;
/**
 *
 * @param {string} remoteUri
 * @param {string} fileId
 */
module.exports.success = (remoteUri, fileId = null) =>
  new UploadResult(null, remoteUri, fileId);

/**
 *
 * @param {Error} error
 */
module.exports.error = (error) => new UploadResult(error);
