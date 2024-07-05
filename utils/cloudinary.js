const cloudinary = require('cloudinary')
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});


const checkResourceExists = async (publicId) => {
    try {
      const result = await cloudinary.api.resource(publicId);
      console.log('Resource exists');
      return true;
    } catch (error) {
      if (error.http_code === 404) {
        console.log('Resource not found');
        return false;
      } else {
        console.error('Error checking resource');
        throw new Error(error.message)
      }
    }
  };


const cloudinaryUploadImg = async(fileToUpload)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload,(result)=>{
                resolve({
                    url:result.secure_url,
                    asset_id:result.asset_id,
                    public_id:result.public_id,
                },
                {
                    resource_type:"auto",
                }
            );
        });
    });
};

const cloudinaryDeleteImg = async(fileToDelete)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.destroy(fileToDelete,(result)=>{
                resolve({
                    url:result.secure_url,
                    asset_id:result.asset_id,
                    public_id:result.public_id,
                },
                {
                    resource_type:"auto",
                }
            );
        });
    });
};

module.exports = {cloudinaryUploadImg,checkResourceExists,cloudinaryDeleteImg}