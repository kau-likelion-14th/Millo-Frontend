import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/FriendSearch.css";
import searchIcon from "../../../assets/icon/search.png";

// 이 컴포넌트는 FriendPage.js에서 호출
// FriendSearch 컴포넌트: 이름/태그로 유저를 검색하고 팔로우 요청을 보내는 컴포넌트
// - title: 섹션 제목 (기본값: 팔로우 요청)
// - placeholder: 검색창 안내 문구 (기본값: 이름/태그로 검색)
// - onFollow: 팔로우 버튼 클릭 시 실행할 함수 
// - followingList: 현재 팔로우 중인 친구 목록 

// 검색 대상 유저 목록 (실제 서비스에서는 API에서 받아온다)
const dummyUsers = [
    {
        id: "1",
        userId: 1,
        name: "나나",
        tag: "1234",
        bio: "안녕하세요! 저는 나나입니다.",
        profileImageUrl: null,
    },
    {
        id: "2",
        userId: 2,
        name: "얀",
        tag: "2342",
        bio: "^^",
        profileImageUrl: null,
    },
    {
        id: "3",
        userId: 3,
        name: "지말",
        tag: "1214",
        bio: "ㅎㅎ",
        profileImageUrl: null,
    },
    {
        id: "4",
        userId: 4,
        name: "코다",
        tag: "1223",
        bio: ";ㅁ;",
        profileImageUrl: null,
    },
    {
        id: "5",
        userId: 5,
        name: "딜런",
        tag: "1777",
        bio: ".",
        profileImageUrl: null,
    },
];

function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow,
  followingList = [],
}) {
  // useNavigate: 페이지 이동을 위한 React Router 훅
  const navigate = useNavigate();

  // query: 검색창 입력값을 저장하는 state
  // 값이 바뀔 때마다 아래 results가 자동으로 다시 계산되어 검색 결과가 실시간으로 반영
  const [query, setQuery] = useState("");

  // followingIdSet: followingList 배열에서 id만 뽑아 Set으로 만든 값
  // Set을 쓰면 .has()로 이미 팔로우한 유저인지 빠르게 확인할 수 있음
  // useMemo를 써서 followingList가 바뀔 때만 다시 계산
  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id));
  }, [followingList]);

  // results: query를 기반으로 dummyUsers 배열을 필터링한 검색 결과
  // - query가 빈 문자열이면 빈 배열 반환 (검색창이 비어있을 때 목록 미표시)
  // - 이름, 태그, 또는 이름#태그 형태로 검색어가 포함되면 결과에 포함
  // - useMemo를 써서 query가 바뀔 때만 다시 계산한다.
  const results = useMemo(() => {
    const q = query.trim();

    if (!q) return [];

    return dummyUsers.filter((user) => {
      return (
        user.name.includes(q) ||
        user.tag.includes(q) ||
        `${user.name}#${user.tag}`.includes(q)
      );
    });
  }, [query]);

  // 유저 항목 클릭 시 실행되는 함수
  // /friends/detail 경로로 이동하면서 state에 friend 객체를 담아 전달한다.
  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } });
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>

      {/* 검색 입력창: onChange 이벤트 발생 시 query state 업데이트 → results 자동 재계산 */}
      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src={searchIcon}
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        <input
          className="friend-search__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {/* query가 비어있으면 아무것도 표시 안 함
          결과가 없으면 안내 문구 표시, 있으면 목록 렌더링 */}
      {query.trim() === "" ? null : results.length === 0 ? (
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        <ul className="friend-search__list">
          {/* results 배열을 map으로 순회하여 검색 결과 항목 렌더링 */}
          {results.map((user) => {
            // 현재 유저가 이미 팔로우 중인지 확인 → 버튼 상태(팔로우/팔로잉) 결정에 사용
            const isFollowing = followingIdSet.has(user.id);

            return (
              <li key={user.id} className="friend-search__item">
                {/* 왼쪽 영역: 프로필 + 이름/태그/소개글 → 클릭 시 상세 페이지 이동 */}
                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}
                  onClick={() => goFriendDetail(user)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user);
                  }}
                >
                  <div className="friend-avatar" aria-hidden="true">
                    {/* profileImageUrl이 있으면 이미지, 없으면 기본 아이콘(UserIcon) 표시 */}
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  <div className="friend-info">
                    <div className="friend-info__top">
                      {/* user 객체에서 name과 tag를 꺼내 표시 */}
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>

                    <div className="friend-info__bio">
                      {user.bio || "한 줄 소개"}
                    </div>
                  </div>
                </div>

                {/* 팔로우 버튼: isFollowing이 true이면 팔로잉으로 표시하고 비활성화
                    false이면 팔로우 표시, 클릭 시 FriendPage에서 받은 onFollow 호출
                    → followList 배열에 해당 유저가 추가되어 팔로우 목록에 나타남 */}
                <button
                  type="button"
                  className={`friend-follow-btn ${
                    isFollowing ? "is-disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow?.(user); // onFollow가 존재할 때만 호출
                  }}
                  disabled={isFollowing}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// UserIcon 컴포넌트: 프로필 이미지가 없을 때 표시되는 기본 아바타 아이콘
// SVG로 사람 모양을 그리며, FriendSearch 내부에서만 사용
function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default FriendSearch;