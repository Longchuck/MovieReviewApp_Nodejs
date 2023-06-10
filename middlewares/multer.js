const multer = require('multer');
const storage = multer.diskStorage({});

const fileFilter = (req,file,cb) => {
    console.log('long123'+file);
    console.log(req);
    if(!file.mimetype.startsWith('image')){
        cb('supported only image file!!',false)
    }
    cb(null,true);
}
exports.uploadImage = multer({storage, fileFilter});