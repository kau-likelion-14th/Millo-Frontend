import React from "react";
import "../../../styles/MyPage.css";
import Profile from "./Profile";
import Status from "./Status";

function MyPage() {
    return (
        <div className="mypage-container">
            <Profile />
            <Status />
        </div>
    );
}

export default MyPage;