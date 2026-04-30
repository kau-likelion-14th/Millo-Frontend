import React from "react";
import "../../../styles/MyPage.css";
import Profile from "./Profile";
import Status from "./Status";

const MyPage = () => {
  return (
    <main className="mypage">
      <Profile />
      <Status />
    </main>
  );
};

export default MyPage;