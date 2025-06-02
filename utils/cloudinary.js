import { v2 as cloundinary } from "cloudinary"
import fs from "fs"

cloundinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const FileUploader = async (FilePath) => {
    try {
        if (!FilePath) return null
        const response = await cloundinary.uploader.upload(FilePath, {
            resource_type: "auto"
        })
        console.log("File is uploaded ", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(FilePath);
        // Remove the locally temporary file as the upload operation got failed..
        return null
    }
}

export { FileUploader };