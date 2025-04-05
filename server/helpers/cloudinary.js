const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dlpoie7pk',
    api_key:'985389193672649',
    api_secret:'WBu63za3GHdzaAzWwE5JnKaVb4Y'
})

const storage = new multer.memoryStorage();

async function handleImageUpload(file){
    const result = await cloudinary.uploader.upload(file,{
        resource_type:'auto'
    })
    return result;
}

const upload = multer({storage})

module.exports={upload,handleImageUpload}



