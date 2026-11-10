import React, { useEffect, useMemo, useState } from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import { get } from "../../Api";
import config from "../../Config";

const uid = () => Date.now() + Math.random();

const DefaultCategories = {
    공부: { backgroundColor: '#E5F8F1', color: '#333' },
    운동: { backgroundColor: '#FFC8BE', color: '#333' },
    동아리: { backgroundColor: '#B6DAFF', color: '#333' },
};

const PALETTE = ['#E5F8F1', '#FFC8BE', '#B6DAFF', '#FFF1B6', '#E3D4FF', '#FFD9EC'];

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const Todo = ({ selectedDate, todosByDate, setTodosByDate, onToggleComplete }) => {
    const dateKey = toDateKey(selectedDate);
    const todos = todosByDate[dateKey] ?? [];

    const [serverCategories, setServerCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await get(config.CATEGORIES.GET);
                console.log("카테고리 응답:", res);
                setServerCategories(Array.isArray(res?.result) ? res.result : []);
            } catch (error) {
                console.error("카테고리 조회 실패:", error);
            }
        };
        fetchCategories();
    }, []);

    const categories = useMemo(() => {
        if (serverCategories.length === 0) return DefaultCategories;

        const map = {};
        serverCategories.forEach((c, i) => {
            const name = c.categoryName ?? c.name;
            if (!name) return;
            map[name] = {
                backgroundColor: c.color ?? DefaultCategories[name]?.backgroundColor ?? PALETTE[i % PALETTE.length],
                color: '#333',
            };
        });
        return Object.keys(map).length > 0 ? map : DefaultCategories;
    }, [serverCategories]);

    const setTodos = (updater) => {
        setTodosByDate((prev) => {
            const current = prev[dateKey] ?? [];
            const nextTodos = typeof updater === "function" ? updater(current) : updater;
            return { ...prev, [dateKey]: nextTodos };
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const openModal = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handledSaveTodo = ({ text, category }) => {
        if (editingTodo) {
            setTodos((prev) =>
                prev.map((t) =>
                    t.id === editingTodo.id ? { ...t, text, category } : t
                )
            );
        } else {
            setTodos((prev) => [
                ...prev,
                { id: uid(), text, category, completed: false },
            ]);
        }
        setIsModalOpen(false);
    };

    const handledDeleteTodo = () => {
        if (!editingTodo) return;
        setTodos((prev) => prev.filter((t) => t.id !== editingTodo.id));
        setIsModalOpen(false);
    };

    const counts = useMemo(() => {
        const total = todos.length;
        const done = todos.filter((t) => t.completed).length;
        return { total, done };
    }, [todos]);

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>
                <button className="todo-add" onClick={openModal}>+</button>
            </div>
            <div className="todo-list">
                {todos.map((t) => (
                    <div
                        key={t.id}
                        className={`todo-item ${t.completed ? 'done' : ''}`}
                        onClick={() => openEditModal(t)}
                    >
                        <button
                            className={`checkbox ${t.completed ? 'checked' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete?.(t);
                            }}
                        >
                        </button>
                        <div className="todo-text">{t.text}</div>
                        <div
                            className="todo-category"
                            style={categories[t.category]}
                        >
                            {t.category}
                        </div>
                    </div>
                ))}
            </div>
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handledSaveTodo}
                onDelete={handledDeleteTodo}
                initialTodo={editingTodo}
                categories={categories}
            />
        </div>
    );
};

export default Todo;