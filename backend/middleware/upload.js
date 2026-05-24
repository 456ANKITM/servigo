import multer from "multer";

const storage = multer.memoryStorage({
  destination:"uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

export const upload = multer ({storage})

export const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 }
]);

