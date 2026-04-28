import React, { useState, useRef } from "react";
import profileImg from "../../../assets/img/logo.png";

function Profile() {
    const fileInputRef = useRef(null);
    const handleClickEditIcon = () => {
        fileInputRef.current?.click();
    };

    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImageFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const profileImageUrl = null;
    const displayImageSrc = previewUrl || profileImageUrl || profileImg;

    const [bio, setBio] = useState("");
    const [song, setSong] = useState("");

    const handleSave = () => {
        console.log("소개:", bio);
        console.log("노래:", song);
        console.log("이미지 파일:", selectedImageFile);
    };

    return (
        <div className="profile-section">
            <div className="profile-top">
                <div className="profile-img-wrap">
                    <img src={displayImageSrc} alt="프로필" className="profile-img" />
                    <button className="edit-icon-btn" onClick={handleClickEditIcon}>✏️</button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>
                <p className="profile-nickname">Millo</p>
                <button className="save-btn" onClick={handleSave}>프로필 저장</button>
            </div>
            <div className="profile-inputs">
                <div className="input-group">
                    <label className="input-label">한 줄 소개</label>
                    <input
                        className="profile-input"
                        type="text"
                        placeholder="한 줄 소개를 입력하세요"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">좋아하는 노래</label>
                    <div className="song-input-wrap">
                        <span className="song-icon">🎵</span>
                        <input
                            className="profile-input song-input"
                            type="text"
                            placeholder="좋아하는 노래를 입력하세요"
                            value={song}
                            onChange={(e) => setSong(e.target.value)}
                        />
                        <span className="search-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;