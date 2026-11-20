import React, { useEffect, useMemo, useState } from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import { get } from "../../Api";
import config from "../../Config";

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

const Todo = ({
    selectedDate,
    todosByDate,
    onToggleComplete,
    onCreateTodo,
    onUpdateTodo,
    onDeleteTodo,
    onGetTodoDetail,
}) => {
    const dateKey = toDateKey(selectedDate);
    const todos = useMemo(() => todosByDate[dateKey] ?? [], [todosByDate, dateKey]);

    const [serverCategories, setServerCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await get(config.CATEGORIES.GET);
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // [+] 버튼: 새로 만들기
    const openModal = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    // 기존 할 일 클릭: 상세 조회로 루틴 정보까지 불러온 뒤 수정 모달 열기
    const openEditModal = async (todo) => {
        const detail = await onGetTodoDetail?.(todo.id);
        setEditingTodo({
            ...todo,
            routineEnabled: detail?.routineEnabled ?? false,
            routine: detail?.routine ?? null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTodo(null);
    };

    // 저장 버튼: 수정 또는 추가
    const handleSaveTodo = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const ok = editingTodo
            ? await onUpdateTodo?.(editingTodo.id, data)
            : await onCreateTodo?.(data);

        setIsSubmitting(false);
        if (ok) closeModal();
    };

    // 삭제 버튼
    const handleDeleteTodo = async () => {
        if (!editingTodo || isSubmitting) return;
        if (!window.confirm("이 할 일을 삭제할까요?")) return;

        setIsSubmitting(true);
        const ok = await onDeleteTodo?.(editingTodo.id);
        setIsSubmitting(false);
        if (ok) closeModal();
    };

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
                onClose={closeModal}
                onSave={handleSaveTodo}
                onDelete={handleDeleteTodo}
                initialTodo={editingTodo}
                categories={categories}
            />
        </div>
    );
};

export default Todo;