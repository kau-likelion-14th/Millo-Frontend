import React, { useState, useEffect } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import "../../styles/MainPage.css";
import { get, patch } from "../../Api";
import config from "../../Config";

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [todosByDate, setTodosByDate] = useState({});
  const [remainingByDate, setRemainingByDate] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth() + 1;
        const res = await get(config.CALENDAR.GET, { year, month });
        console.log("캘린더 응답:", res);

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

  useEffect(() => {
    const fetchTodos = async () => {
      const dateKey = toDateKey(selectedDate);
      try {
        const res = await get(config.TODOS.LIST, { date: dateKey });
        console.log("Todo 응답:", res);

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

  const handleToggleComplete = async (todo) => {
    const dateKey = toDateKey(selectedDate);
    try {
      await patch(config.TODOS.TOGGLE_COMPLETE(todo.id, dateKey), {
        completed: !todo.completed,
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
      alert("완료 상태 변경에 실패했어요.");
    }
  };

  return (
    <div className="mainpage-container">
      <CustomCalendar
        initialDate={selectedDate}
        onDateChange={setSelectedDate}
        todosByDate={todosByDate}
        remainingByDate={remainingByDate}
        onMonthChange={setViewDate}
      />
      <Todo
        selectedDate={selectedDate}
        todosByDate={todosByDate}
        setTodosByDate={setTodosByDate}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};

export default MainPage;