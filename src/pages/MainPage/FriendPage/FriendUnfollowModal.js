import React, { useEffect } from "react";
import "../../../styles/FriendUnfollowModal.css";

// 컴포넌트는 FriendPage.js에서 호출된다.
// FriendUnfollowModal 컴포넌트: 언팔로우 확인을 위한 모달창
// - isOpen: 모달 열림/닫힘 여부 (true이면 화면에 표시)
// - friend: 언팔로우 대상 친구 정보 (이름, 태그 표시에 사용)
// - onConfirm: 예 버튼 클릭 시 실행할 함수
// - onClose: 아니오 버튼 또는 모달 외부 클릭 시 실행할 함수
function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) {

  // useEffect: isOpen이나 onClose가 바뀔 때마다 실행됨
  // 모달이 열려있을 때 Escape 키를 누르면 onClose를 호출해 모달을 닫음
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // isOpen이 false이면 null을 반환해 모달을 화면에서 완전히 제거
  if (!isOpen) return null;

  // friend props에서 name과 tag를 꺼내 표시할 문자열로 가공
  // friend가 null일 경우를 대비해 옵셔널 체이닝(?.)과 null 병합 연산자(??)로 기본값 처리
  const displayName = friend?.name ?? "";
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  // 오버레이(배경) 클릭 시 실행되는 함수
  // e.target(클릭된 요소)과 e.currentTarget(이벤트가 등록된 요소)이 같을 때만 onClose 호출
  // → 모달 내부 클릭 시에는 닫히지 않고, 배경 클릭 시에만 닫힘
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    // 모달 배경(오버레이): 클릭 시 handleOverlayClick 실행
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}>
      <div
        className="friend-unfollow-modal__content"
        role="dialog"
        aria-modal="true"
      >
        {/* displayName, displayTag를 조합해 언팔로우 대상 친구 이름 표시 */}
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">{displayName}</span>{" "}
          <span className="friend-unfollow-modal__tag">{displayTag}</span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>

        <div className="friend-unfollow-modal__actions">
          {/* 예 버튼: onConfirm 호출 → FriendPage에서 followList에서 해당 친구 제거 후 모달 닫힘 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm}
          >
            예
          </button>

          {/* 아니오 버튼: onClose 호출 → followList는 그대로, 모달만 닫힘 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;