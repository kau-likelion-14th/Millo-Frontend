import React, { useMemo } from "react";

import "../../../styles/Todo.css";
import "../../../styles/FriendTodo.css";

// 이 컴포넌트는 FriendDetailPage.js에서 호출
// FriendTodo 컴포넌트: 친구의 할 일 목록을 읽기 전용으로 표시하는 컴포넌트
// 본인의 Todo와 달리 수정/삭제 기능 없이 조회만 가능

const FriendTodo = ({ title = "To do List" , todos = [], categories = {} }) => {

  return (
    <div className="friend-todo">
      <div className="todo-container">
        <div className="todo-header">
          {/* title props를 그대로 표시 */}
          <div className="todo-title">{title}</div>
        </div>

        <div className="todo-list">
          {/* todos 배열이 비어있으면 안내 문구 표시, 있으면 목록 렌더링 */}
          {todos.length === 0 ? (
            <div className="friend-todo__empty">등록된 투두가 없습니다.</div>
          ) : (
            // todos 배열을 map으로 순회하여 각 할 일 항목 렌더링
            todos.map((t) => (
              <div key={t.id} className={`todo-item ${t.completed ? "done" : ""}`}>
                {/* t.completed가 true이면 checked 클래스 추가 → 체크박스가 완료 상태로 표시 */}
                <div className={`checkbox ${t.completed ? "checked" : ""}`} />

                {/* 할 일 내용 텍스트 */}
                <div className="todo-text">{t.text}</div>

                {/* 카테고리 태그: categories 객체에서 해당 카테고리의 색상을 꺼내 style로 적용
                    categories에 해당 카테고리가 없으면 undefined를 넘겨 기본 스타일 유지 */}
                <div
                  className="todo-category"
                  style={categories[t.category] ?? undefined}
                >
                  {t.category}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default FriendTodo;