
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const ProfilePicUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image || !auth.currentUser) return;

    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);

    await updateProfile(auth.currentUser, { photoURL: url });
    alert('Profile updated!');
    window.location.reload();
  };

  return (
    <div className="upload-box">
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" style={{ width: 80, height: 80, borderRadius: "50%", marginTop: 10 }} />}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default ProfilePicUploader;
