import { useNavigate } from "react-router-dom";
import deleteIcon from "../../../assets/icon/delete.png";
import "../../../styles/FriendList.css";

//이 컴포넌트는 FriendPage.js에서 호출
// FriendList 컴포넌트: 팔로우 목록 또는 팔로우 요청 목록을 렌더링하는 컴포넌트
// props로 받은 friends 배열을 화면에 보여주고, 클릭 시 상세 페이지 이동 또는 삭제 기능을 처리
// - friends: 표시할 친구 객체 배열 (기본값: 빈 배열)
// - onClickRemove: 삭제 버튼 클릭 시 실행할 함수 (부모 컴포넌트에서 전달)
// - emptyText: 친구가 없을 때 표시할 문구 (기본값: 팔로우하는 친구가 없습니다.)
function FriendList(
  {
    title = "팔로우 목록",
    friends = [],
    onClickRemove,
    emptyText = "팔로우하는 친구가 없습니다.",
  }
) {
  // useNavigate: 페이지 이동을 위한 React Router 훅
  // navigate 함수를 호출하면 브라우저 URL이 바뀌며 해당 Route의 컴포넌트가 렌더링됨
  const navigate = useNavigate();

  // 친구 항목 클릭 시 실행되는 함수
  // /friends/:id 경로로 이동하면서 state에 friend 객체를 담아 전달
  // FriendDetailPage에서 useLocation().state.friend로 이 데이터를 꺼내 씀
  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  return (
    <section className="friend-list">
      {/* title props를 그대로 표시 */}
      <h2 className="friend-list__title">{title}</h2>

      {/* friends 배열이 비어있으면 안내 문구 표시, 있으면 목록 렌더링 */}
      {friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        <ul className="friend-list__items">
          {/* friends 배열을 map으로 순회하여 각 친구 항목을 li로 렌더링 */}
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item">

              {/* 왼쪽 영역: 프로필 + 이름/태그/소개글 → 클릭 시 상세 페이지 이동 */}
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => {
                  goFriendDetail(friend); // 클릭된 friend 객체를 넘겨 상세 페이지로 이동
                }}
                >
                <div className="friend-avatar" aria-hidden="true">
                  {/* profileImageUrl이 있으면 이미지, 없으면 기본 아이콘(UserIcon) 표시 */}
                  {friend.profileImageUrl ? (
                    <img
                      className="friend-avatar__img"
                      src={friend.profileImageUrl}
                      alt="프로필 사진"
                      />
                  ) : (
                    <UserIcon/>
                  )}
                </div>

                <div className="friend-info">
                  <div className="friend-info__top">
                    {/* friend 객체에서 name과 tag를 꺼내 표시 */}
                    <span className="friend-info__name">{friend.name}</span>
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>
                  {/* bio(소개글)가 있으면 표시, 없으면 안내 문구 표시 */}
                  {friend.bio ?(
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 삭제 버튼: e.stopPropagation()으로 부모 클릭(상세 페이지 이동)이 함께 실행되지 않도록 막고
                  onClickRemove에 해당 friend 객체를 전달 → 부모 컴포넌트에서 목록에서 제거 처리 */}
              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(e)=>{
                  e.stopPropagation();
                  onClickRemove?.(friend); // onClickRemove가 존재할 때만 호출
                }}
                >
                  <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
                </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// UserIcon 컴포넌트: 프로필 이미지가 없을 때 표시되는 기본 아바타 아이콘
// SVG로 사람 모양을 그리며, FriendList 내부에서만 사용
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

export default FriendList;