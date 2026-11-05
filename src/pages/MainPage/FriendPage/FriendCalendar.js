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

export default function FriendCalendar ({
  initialDate,
  onDateChange,
  onMonthChange,
  remainingByDate ={},
}) {
  const getDayMeta = (date) => {
    const day = remainingByDate[toDateKey(date)];

    return{
      hasTodos:day?.hasTodo === true,
      remaining: day?.remaining ?? 0,
      allDone: day?.hasTodo === true && day.remaining ===0,
    };
  };


  return (
    <div className="calendar-container">
      {/* react-calendar 라이브러리 컴포넌트
          onChange: 날짜 클릭 시 handleDateChange 실행 → selectedDate state 업데이트
          value: 현재 선택된 날짜 (selectedDate state) */}
      <Calendar
        onChange={(value) => onDateChange?.(value instanceof Date ? value: value?.[0])}
        onActiveStartDateChange={({activeStartDate}) => onMonthChange?.(activeStartDate)}
        value={initialDate}
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