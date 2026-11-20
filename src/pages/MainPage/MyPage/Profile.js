import React, { useRef, useState, useEffect } from "react";
import { get, put, post, uploadProfile } from "../../../Api";
import config from "../../../Config";

const profileImg = "https://via.placeholder.com/120";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // 노래 입력창에 보이는 글자 (검색어 겸 선택된 노래 표시)
  const [song, setSong] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await get(config.PROFILE.GET);
      const result = response?.result;

      console.log("프로필 데이터:", result);
      if (!result) return;

      setNickname(result.username ?? "");
      setIntro(result.introduction ?? "");
      setProfileImageUrl(result.profileImageUrl ?? null);

      const songResponse = await get(config.YOUTUBE.ME);

      if (
        songResponse?.isSuccess === false ||
        !Array.isArray(songResponse?.result)
      ) {
        throw new Error("저장된 노래 조회 실패");
      }

      const songs = [...songResponse.result].sort(
        (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt)
      );

      const latest = songs[0];
      setSong(latest ? `${latest.title} - ${latest.artist}` : "");
    } catch (error) {
      console.error("프로필 조회 실패:", error);
    }
  };

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      await put(config.PROFILE.INTRO, { introduce: intro });

      if (selectedImageFile) {
        await uploadProfile(
          config.PROFILE.PUT,
          { imageFile: selectedImageFile },
          { imageField: "image", }
        );
      }

      await handleSaveSong();
      await fetchProfileData();

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl("");
      setSelectedImageFile(null);

      alert("프로필이 저장됐어요!");
    } catch (error) {
      console.error("프로필 저장 중 오류 발생:", error);

      const message =
        error?.response?.data?.message ?? "프로필 저장 중 오류 발생";

      alert(message);
    }
  };

  const handleSearchSong = async () => {
    if (!song.trim()) {
      alert("검색할 노래를 입력해주세요");
      return;
    }

    try {
      const response = await get(config.YOUTUBE.SEARCH, { q: song.trim() });
      console.log("노래 검색 결과:", response);

      const results = response?.result ?? [];

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("노래 검색 실패:", error);
      alert("노래 검색에 실패했습니다.");
    }
  };

  // 검색 결과에서 노래를 클릭했을 때
  const handleSelectSong = (item) => {
    setSelectedSong(item);
    setSong(`${item.title} - ${item.artist}`);
    setShowResults(false);
  };

  const handleSaveSong = async () => {
    if(!selectedSong) return ;

    try{
      await post(config.YOUTUBE.SAVE,{
        songId: selectedSong.songId,
        title: selectedSong.title,
        artist:selectedSong.artist,
      });
      console.log("노래 저장 완료");

      setSelectedSong(null);
    }catch(error) {
      console.error("노래 저장 실패:", error);
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayImageSrc = previewUrl || profileImageUrl || profileImg;

  return (
    <div className="profile-section">
      <div className="profile-left">
        <div className="profile-top">
          <div className="profile-image-box">
            <img src={displayImageSrc} alt="프로필 이미지" className="profile-img" />

            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleClickEditIcon}
            >
              ✎
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="profile-file-input"
              onChange={handleFileChange}
            />
          </div>

          <h2 className="profile-nickname">{nickname}</h2>
        </div>

        <div className="profile-form">
          <label className="profile-label">한 줄 소개</label>
          <input
            className="profile-input"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="한 줄 소개를 입력해주세요"
          />

          <label className="profile-label">좋아하는 노래</label>
          <div className="song-input-box">
            <span className="song-icon">🎵</span>
            <input
              className="song-input"
              value={song}
              placeholder="좋아하는 노래를 입력해주세요"
              onChange={(e) => {
                setSong(e.target.value);
                setSelectedSong(null);
                setShowResults(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSong();
                }
              }}
            />
            <span className="search-icon" onClick={handleSearchSong}>
              ⌕
            </span>
          </div>

          {showResults && (
            <div className="song-search-results">
              {searchResults.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item.songId}
                    className="song-search-item"
                    onClick={() => handleSelectSong(item)}
                  >
                    {item.title} - {item.artist}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <button type="button" className="profile-save-btn" onClick={handleSaveProfile}>
        프로필 저장
      </button>
    </div>
  );
};

export default Profile;