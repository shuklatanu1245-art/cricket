import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import os from 'os';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DB_FILE_NAME = "cricket_db.json";

export const getDb = async () => {
  try {
    const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${DB_FILE_NAME}?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return { tournaments: [], registrations: [] };
    }
    return await res.json();
  } catch (e) {
    console.error("Failed to read DB from Cloudinary", e);
    return { tournaments: [], registrations: [] };
  }
};

export const saveDb = async (data: any) => {
  try {
    const tmpPath = path.join(os.tmpdir(), DB_FILE_NAME);
    fs.writeFileSync(tmpPath, JSON.stringify(data));
    
    await cloudinary.uploader.upload(tmpPath, {
      resource_type: "raw",
      public_id: DB_FILE_NAME,
      overwrite: true,
      invalidate: true
    });
  } catch (e: any) {
    console.error("Failed to save DB to Cloudinary", e);
    throw new Error("DB Save Failed: " + (e.message || String(e)));
  }
};
