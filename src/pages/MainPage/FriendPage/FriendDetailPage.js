import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../../styles/FriendDetailPage.css";

// 이 컴포넌트는 App.js에서 /friends/:id 경로로 접근할 때 렌더링됨
// FriendDetailPage 컴포넌트: 특정 친구의 상세 페이지
// FriendList에서 친구 항목 클릭 시 navigate로 전달받은 friend 정보를 보여주고
// 날짜별 할 일 목록과 저장된 음악을 함께 표시

// 카테고리별 색상 정의 객체
// FriendTodo 컴포넌트에 props로 전달되어 각 할 일 태그 색상에 사용
const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

// 날짜 객체를 "YYYY-MM-DD" 형식의 문자열로 변환하는 함수
// dummyTodosByDate의 key와 형식을 맞추기 위해 사용
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 친구 더미 데이터 (FriendList에서 navigate로 전달받은 값이 없을 때 기본값으로 사용)
const dummyFriend = {
  followId: "1",
  name: "나나",
  tag: "1234",
  bio: "안녕하세요! 저는 나나입니다.",
  profileImage: null,
};

// 저장된 음악 더미 데이터 (실제 서비스에서는 API에서 받아온다)
const dummySavedSongs = [
  {
    id: 1,
    title: "Ditto",
    artist: "NewJeans",
    imageUrl: null,
  },
];

// 날짜별 할 일 목록 더미 데이터 (실제 서비스에서는 API에서 받아온다)
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
    { id: 2, text: "FriendDetailPage 주석 달기", category: "공부", completed: false },
  ],
  "2026-05-06": [
    { id: 3, text: "친구 페이지 과제 제출", category: "동아리", completed: true },
  ],
  "2026-05-10": [
    { id: 4, text: "React 복습하기", category: "공부", completed: false },
    { id: 5, text: "동아리 회의", category: "동아리", completed: false },
    { id: 6, text: "산책하기", category: "일상", completed: true },
  ],
};

// 날짜별 미완료 할 일 개수 더미 데이터
// FriendCalendar에서 날짜 칸에 남은 할 일 개수를 표시하는 데 사용
const dummyRemainingByDate = {
  "2026-05-04": { hasTodo: true, remaining: 1 },
  "2026-05-06": { hasTodo: true, remaining: 0 },
  "2026-05-10": { hasTodo: true, remaining: 2 },
};

function FriendDetailPage() {
  // useNavigate: 뒤로가기 버튼 클릭 시 이전 페이지로 이동하기 위한 훅
  const navigate = useNavigate();

  // useLocation: FriendList에서 navigate로 전달한 state를 꺼내기 위한 훅
  // location.state?.friend에 FriendList에서 클릭한 친구 정보가 담김
  const location = useLocation();
  const passedFriend = location.state?.friend ?? null;

  // friend: 화면에 표시할 친구 정보 state
  // navigate로 전달받은 값이 있으면 그 값을, 없으면 dummyFriend를 기본값으로 사용
  const [friend] = useState(passedFriend ?? dummyFriend);

  // savedSongs: 친구가 저장한 음악 목록 state (실제 서비스에서는 API에서 받아온다)
  const [savedSongs] = useState(dummySavedSongs);

  // selectedDate: 캘린더에서 현재 선택된 날짜 state
  // 날짜가 바뀌면 아래 todos가 자동으로 해당 날짜의 할 일 목록으로 업데이트
  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-04"));

  // viewDate: 캘린더에서 현재 보고 있는 월 state
  // 월이 바뀔 때 업데이트되며 이후 월별 데이터 로딩 등에 활용할 수 가능
  const [viewDate, setViewDate] = useState(new Date("2026-05-04"));

  const [todosByDate] = useState(dummyTodosByDate);
  const [remainingByDate] = useState(dummyRemainingByDate);

  // latestSong: savedSongs 배열에서 가장 첫 번째 곡을 꺼내 상단에 표시
  // useMemo를 써서 savedSongs가 바뀔 때만 다시 계산
  const latestSong = useMemo(() => {
    if (!Array.isArray(savedSongs) || savedSongs.length === 0) return null;
    return savedSongs[0];
  }, [savedSongs]);

  // todos: 현재 선택된 날짜(selectedDate)의 할 일 목록
  // selectedDate가 바뀌면 toDateKey로 key를 만들어 todosByDate에서 해당 날짜 배열을 꺼냄
  // useMemo를 써서 selectedDate나 todosByDate가 바뀔 때만 다시 계산
  const todos = useMemo(() => {
    const key = toDateKey(selectedDate);
    return todosByDate[key] ?? [];
  }, [selectedDate, todosByDate]);

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        <div className="friend-detail-page__top">

          {/* 뒤로가기 버튼: navigate(-1) 호출 → 이전 페이지(친구 목록)로 돌아간다 */}
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          {/* 친구 프로필 영역: friend state에서 name, bio, profileImage를 꺼내 표시 */}
          <div className="friend-detail-page__profile">
            <div className="friend-detail-page__avatar" aria-hidden="true">
              {/* profileImage가 있으면 이미지, 없으면 기본 아이콘(UserIcon) 표시 */}
              {friend?.profileImage ? (
                <img
                  src={friend.profileImage}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserIcon />
              )}
            </div>

            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">
                  {friend?.name || " "}
                </span>
              </div>
              <div className="friend-detail-page__bio">
                {friend?.bio || "한 줄 소개"}
              </div>
            </div>
          </div>

          {/* 음악 카드 영역: latestSong이 있으면 곡 정보 표시, 없으면 안내 문구 표시 */}
          <div className="friend-detail-page__songs-inline">
            {latestSong ? (
              <div className="friend-detail-page__song-inline-item">
                <div className="friend-detail-page__song-inline-cover">
                  {latestSong?.imageUrl ? (
                    <img
                      src={latestSong.imageUrl}
                      alt={latestSong.title || "album"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : null}
                </div>

                <div className="friend-detail-page__song-inline-info">
                  <div className="friend-detail-page__song-inline-title">
                    {latestSong?.title || "제목 없음"}
                  </div>
                  <div className="friend-detail-page__song-inline-artist">
                    {latestSong?.artist || "아티스트 정보 없음"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="friend-detail-page__songs-inline-empty">
                저장한 곡이 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="friend-detail-page__grid">
          {/* FriendCalendar: 선택된 날짜와 할 일 데이터를 props로 전달
              날짜 클릭 시 onDateChange가 실행되어 selectedDate state가 바뀌고
              → todos가 자동으로 해당 날짜의 할 일 목록으로 업데이트된다. */}
          <div className="friend-detail-page__calendar">
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              onMonthChange={(date) => {
                if (!date) return;
                setViewDate(date);
              }}
              todosByDate={todosByDate}
              remainingByDate={remainingByDate}
            />
          </div>

          {/* FriendTodo: 선택된 날짜의 할 일 목록(todos)과 카테고리 색상(Categories)을 props로 전달
              selectedDate가 바뀌면 todos가 바뀌어 화면에 다른 날짜의 할 일이 표시된다. */}
          <div className="friend-detail-page__todo">
            <FriendTodo
              title="To do List"
              todos={todos}
              categories={Categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// UserIcon 컴포넌트: 프로필 이미지가 없을 때 표시되는 기본 아바타 아이콘
function UserIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendDetailPage;