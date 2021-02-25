const AWS = require('aws-sdk')
require('dotenv').config()

module.exports = {
  init(providerOptions) {
    // init your provider if necessary
    console.log(providerOptions)
    const credentials = {
      accessKeyId: providerOptions.accessKey,
      secretAccessKey: providerOptions.secretKey,
    }

    const bucketName = providerOptions.bucketName

    const s3client = new AWS.S3({
      credentials,
      /**
       * When working locally, we'll use the Localstack endpoints. This is the one for S3.
       * A full list of endpoints for each service can be found in the Localstack docs.
       */
      endpoint: 'http://localhost:4572',
      /**
        * Including this option gets localstack to more closely match the defaults for
        * live S3. If you omit this, you will need to add the bucketName to the `Key`
        * property in the upload function below.
        *
        * see: https://github.com/localstack/localstack/issues/1180
        */
      s3ForcePathStyle: true,
    })


    const uploadFile = async (data, fileName) =>
      new Promise((resolve) => {
        s3client.upload(
          {
            Bucket: bucketName,
            Key: fileName,
            Body: data,
          },
          (err, response) => {
            if (err) throw err
            resolve(response)
          },
        )
      })

    return {
      upload(file) {
        // upload the file in the provider
        console.log("provider works", file)
        const now = new Date()
        const fileName = `test-image-${now.toISOString()}.jpg`
        uploadFile(file, fileName).then((response) => {
          console.log(":)")
          console.log(response)
        }).catch((err) => {
          console.log(":|")
          console.log(err)
        })
      },
      delete(file) {
        console.log("provider works", file)
        // delete the file in the provider
      },
    };
  },
};