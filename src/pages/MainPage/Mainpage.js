import React, { useState, useEffect } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import "../../styles/MainPage.css";
import { get, post, put, patch, del } from "../../Api";
import config from "../../Config";

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// RoutineModal의 요일 순서(월~일)와 백엔드 WeekEnum을 맞추기 위한 배열
const WEEKS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// 모달에서 받은 값({ text, category, routine })을 백엔드 요청 형식으로 바꾸는 함수
const toRequestBody = ({ text, category, routine }) => {
  const routineEnabled = Boolean(
    routine?.startDate && routine?.endDate && routine?.repeatDays?.length
  );

  return {
    categoryName: category,
    description: text,
    routineEnabled,
    startDate: routineEnabled ? routine.startDate : null,
    endDate: routineEnabled ? routine.endDate : null,
    week: routineEnabled ? WEEKS[routine.repeatDays[0]] : null,
  };
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ?? fallback;

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [todosByDate, setTodosByDate] = useState({});
  const [remainingByDate, setRemainingByDate] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // 추가/수정/삭제/완료 후 캘린더와 Todo 목록을 다시 불러온다
  const refresh = () => setRefreshKey((prev) => prev + 1);

  // 캘린더 월별 데이터 조회
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth() + 1;
        const res = await get(config.CALENDAR.GET, { year, month });

        const days = Array.isArray(res?.result?.days) ? res.result.days : [];
        const map = {};
        days.forEach((day) => {
          if (day.hasTodo) {
            map[day.date] = day.remaining;
          }
        });
        setRemainingByDate(map);
      } catch (error) {
        console.error("캘린더 조회 실패:", error);
      }
    };
    fetchCalendar();
  }, [viewDate, refreshKey]);

  // 선택한 날짜의 Todo 목록 조회
  useEffect(() => {
    const fetchTodos = async () => {
      const dateKey = toDateKey(selectedDate);
      try {
        const res = await get(config.TODOS.LIST, { date: dateKey });

        const list = Array.isArray(res?.result) ? res.result : [];
        const todos = list.map((t) => ({
          id: t.todoId,
          text: t.description,
          category: t.categoryName,
          completed: t.completed ?? t.isCompleted ?? false,
        }));
        setTodosByDate((prev) => ({ ...prev, [dateKey]: todos }));
      } catch (error) {
        console.error("Todo 조회 실패:", error);
        setTodosByDate((prev) => ({ ...prev, [dateKey]: [] }));
      }
    };
    fetchTodos();
  }, [selectedDate, refreshKey]);

  // Todo 상세 조회 (수정 모달을 열 때 루틴 정보를 가져온다)
  const handleGetTodoDetail = async (todoId) => {
    try {
      const res = await get(config.TODOS.DETAIL(todoId));
      const detail = res?.result;
      if (!detail) return null;

      const weekIndex = WEEKS.indexOf(detail.week);

      return {
        routineEnabled: detail.routineEnabled,
        routine: detail.routineEnabled
          ? {
              startDate: detail.startDate ?? "",
              endDate: detail.endDate ?? "",
              repeatDays: weekIndex >= 0 ? [weekIndex] : [],
            }
          : null,
      };
    } catch (error) {
      console.error("Todo 상세 조회 실패:", error);
      return null;
    }
  };

  // Todo 추가 (POST)
  const handleCreateTodo = async (data) => {
    const dateKey = toDateKey(selectedDate);
    try {
      await post(config.TODOS.LIST, toRequestBody(data), {
        params: { date: dateKey },
      });
      refresh();
      return true;
    } catch (error) {
      console.error("Todo 추가 실패:", error);
      alert(getErrorMessage(error, "할 일 추가에 실패했어요."));
      return false;
    }
  };

  // Todo 수정 (PUT)
  const handleUpdateTodo = async (todoId, data) => {
    try {
      await put(config.TODOS.DETAIL(todoId), toRequestBody(data));
      refresh();
      return true;
    } catch (error) {
      console.error("Todo 수정 실패:", error);
      alert(getErrorMessage(error, "할 일 수정에 실패했어요."));
      return false;
    }
  };

  // Todo 삭제 (DELETE) - 선택한 날짜 기준
  const handleDeleteTodo = async (todoId) => {
    const dateKey = toDateKey(selectedDate);
    try {
      await del(config.TODOS.DELETE(todoId, dateKey));
      refresh();
      return true;
    } catch (error) {
      console.error("Todo 삭제 실패:", error);
      alert(getErrorMessage(error, "할 일 삭제에 실패했어요."));
      return false;
    }
  };

  // Todo 완료 상태 변경 (PATCH)
  const handleToggleComplete = async (todo) => {
    const dateKey = toDateKey(selectedDate);
    try {
      await patch(config.TODOS.TOGGLE_COMPLETE(todo.id, dateKey), {
        completed: !todo.completed,
      });
      refresh();
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
      alert(getErrorMessage(error, "완료 상태 변경에 실패했어요."));
    }
  };

  return (
    <div className="mainpage-container">
      <CustomCalendar
        initialDate={selectedDate}
        onDateChange={setSelectedDate}
        remainingByDate={remainingByDate}
        onMonthChange={setViewDate}
      />
      <Todo
        selectedDate={selectedDate}
        todosByDate={todosByDate}
        onToggleComplete={handleToggleComplete}
        onCreateTodo={handleCreateTodo}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
        onGetTodoDetail={handleGetTodoDetail}
      />
    </div>
  );
};

export default MainPage;