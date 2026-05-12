import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../../styles/Calendar.css";

// 이 컴포넌트는 FriendDetailPage.js에서 호출
// FriendCalendar 컴포넌트: 친구의 날짜별 할 일 현황을 캘린더로 보여주는 컴포넌트
// 날짜를 클릭하면 selectedDate state가 바뀌고, 각 날짜 칸에 할 일 완료 여부가 표시

// 날짜 객체를 "YYYY-MM-DD" 형식의 문자열로 변환하는 함수
// dummyTodosByDate의 key와 형식을 맞추기 위해 사용
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0"); // 월을 2자리로 맞춤 (예: 5 → "05")
  const d = String(date.getDate()).padStart(2, "0");       // 일을 2자리로 맞춤 (예: 4 → "04")
  return `${y}-${m}-${d}`;
};

// 날짜별 할 일 목록 더미 데이터 (실제 서비스에서는 API에서 받아온다)
// key는 "YYYY-MM-DD" 형식의 날짜 문자열, value는 해당 날짜의 할 일 배열
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, title: "프론트 보충자료 읽기", completed: true },
    { id: 2, title: "FriendCalendar 주석 달기", completed: false },
  ],
  "2026-05-06": [
    { id: 3, title: "친구 페이지 과제 제출", completed: true },
  ],
  "2026-05-10": [
    { id: 4, title: "React 복습하기", completed: false },
    { id: 5, title: "props 정리하기", completed: false },
    { id: 6, title: "useState 정리하기", completed: true },
  ],
};

export default function FriendCalendar() {
  // selectedDate: 현재 선택된 날짜를 저장하는 state
  // 날짜 클릭 시 이 값이 바뀌며 캘린더에서 해당 날짜가 선택된 상태로 표시
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 캘린더에서 날짜 클릭 시 실행되는 함수
  // 클릭된 값이 단일 Date이면 그대로, 범위 선택이면 첫 번째 날짜를 꺼내 selectedDate state 업데이트
  const handleDateChange = (value) => {
    const next = value instanceof Date ? value : value?.[0];
    if (!next) return;
    setSelectedDate(next);
  };

  // 특정 날짜의 할 일 메타 정보를 반환하는 함수
  // toDateKey로 날짜를 문자열로 변환 후 dummyTodosByDate에서 해당 날짜의 할 일 배열을 조회
  // - hasTodos: 해당 날짜에 할 일이 있는지 여부
  // - remaining: 미완료 할 일 개수 (캘린더 칸에 숫자로 표시)
  // - allDone: 모든 할 일이 완료되었는지 여부 (완료 시 ★ 표시)
  const getDayMeta = (date) => {
    const key = toDateKey(date);
    const list = dummyTodosByDate[key] ?? []; // 해당 날짜 데이터가 없으면 빈 배열

    if (list.length === 0) {
      return { hasTodos: false, remaining: 0, allDone: false };
    }

    // filter로 completed가 false인 항목만 골라 미완료 개수를 계산
    const remaining = list.filter((todo) => !todo.completed).length;

    return {
      hasTodos: true,
      remaining,
      allDone: remaining === 0, // 미완료가 0개이면 전부 완료
    };
  };

  return (
    <div className="calendar-container">
      {/* react-calendar 라이브러리 컴포넌트
          onChange: 날짜 클릭 시 handleDateChange 실행 → selectedDate state 업데이트
          value: 현재 선택된 날짜 (selectedDate state) */}
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        // 날짜 숫자만 표시 (기본값인 "일" 단위 제거)
        formatDay={(locale, date) => String(date.getDate())}

        // tileContent: 각 날짜 칸 안에 추가로 표시할 내용을 반환하는 함수
        // 할 일이 있는 날짜에만 미완료 개수 또는 ★을 표시
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const { hasTodos, remaining, allDone } = getDayMeta(date);
          if (!hasTodos) return null;

          // allDone이 true이면 ★, false이면 미완료 개수 숫자 표시
          return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
        }}

        // tileClassName: 각 날짜 칸에 조건에 따라 CSS 클래스를 추가하는 함수
        // 전부 완료된 날짜는 tile-done, 할 일이 남은 날짜는 tile-has 클래스 적용
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const { hasTodos, allDone } = getDayMeta(date);
          if (!hasTodos) return "";

          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}