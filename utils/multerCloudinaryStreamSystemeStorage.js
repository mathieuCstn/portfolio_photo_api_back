const cloudinary = require('cloudinary').v2
const { join } = require('path')

class MulterCloudinaryStreamSystemeStorage {
  constructor(options) {
    cloudinary.config({
      cloud_name: options.cloudinary_config.cloud_name,
      api_key: options.cloudinary_config.api_key,
      api_secret: options.cloudinary_config.api_secret
    })
  }

  _handleFile = (req, file, callback) => {
      const folder = 'upload-filesysteme'
      const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
      const publicId = join(folder, originalname.replace(/\.[^/.]+$/, ""))
      const cld_upload_stream = cloudinary.uploader.upload_stream({public_id: publicId}, (error, results) => {
        if(error) console.error(error)
        callback(null, {cld_uploaded_file: results, originalname})
      })
      file.stream.pipe(cld_upload_stream)
      file.stream.on('error', callback)
  }
}


/**
 * Storage engine that retrieves the image stream, re-encodes the image name in utf-8 and sends the stream directly to cloudinary.
 * Image information can be accessed from req.file.cld_uploaded_file or req.files.cld_uploaded_file at the endpoint.
 * @param {{cloudinary_config: {cloud_name: string, api_key: string, api_secret: string}}} options 
 * @returns {MulterCloudinaryStreamSystemeStorage}
 * @summary Multer-Cloudinary storage engine
 */
module.exports = function (options) {
  return new MulterCloudinaryStreamSystemeStorage(options)
}