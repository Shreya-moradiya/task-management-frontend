import { DeleteTask, GetTask, MarkCompleted, TaskById, TaskTitle } from "./Services/DashboardService";
import { useEffect, useMemo, useState } from "react";
import AddTask from "../AddTask/AddTask";
import { MdOutlineEdit } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import EditTask from "../EditTask/EditTask";
import Swal from "sweetalert2";
import AddUser from "../AddUser/AddUser";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}-${m}-${y}`;
}

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [taskToggles, setTaskToggles] = useState({});
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "User";
    const userInitial = userName.trim().charAt(0).toUpperCase() || "U";
    const userRole = localStorage.getItem("userRole") || "Employee";
    const fetchTasks = async () => {
        try {
            const response = await GetTask();
            const data = response?.data ?? response;
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setTasks([]);
        }
    };

    const handleEditClick = async (task) => {
        try {
            setLoading(true);
            const id = task?.taskId;
            if (!id) {
                setSelectedTask(task);
                setEditOpen(true);
                return;
            }
            const response = await TaskById(id);
            const data = response?.data ?? response;
            setSelectedTask(data || task);
            setEditOpen(true);
        } catch (error) {
            console.error("Error fetching task by id:", error);
            setSelectedTask(task);
            setEditOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search.trim() !== "") {
                fetchTitle();
            } else {
                setSuggestions([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    const fetchTitle = async () => {
        try {
            const response = await TaskTitle();
            const list = response?.data ?? [];
            const q = search.trim().toLowerCase();
            const filtered = list
                .map((item) => (typeof item === "string" ? item : item?.title ?? ""))
                .filter((title) => title.toLowerCase().includes(q));
            setSuggestions(filtered);
        } catch (error) {
            console.error("Error fetching task titles:", error);
        }
    };

    const displayedTasks = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return tasks;
        return tasks.filter((t) => {
            const title = (t.title || "").toLowerCase();
            const desc = (t.description || "").toLowerCase();
            const status = (t.status || "").toLowerCase();
            return title.includes(q) || desc.includes(q) || status.includes(q);
        });
    }, [tasks, search]);

    const deleteTask = async (taskId) => {
        const resultSwal = await Swal.fire({
            icon: "warning",
            title: "Delete Task?",
            text: "Are you sure you want to delete this task? This action cannot be undone.",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#f16022",
            cancelButtonColor: "#d33",
        });
        if (!resultSwal.isConfirmed) return;
        try {
            await DeleteTask(taskId);
            fetchTasks();
            await Swal.fire({
                icon: "success",
                title: "Task Deleted",
                text: "The task has been deleted successfully.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("companyId");
        localStorage.removeItem("userName");
        navigate("/");
    }

    const confirmLogout = async () => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Logout?",
            text: "Are you sure you want to logout?",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#f16022",
            cancelButtonColor: "#d33",
        });

        if (result.isConfirmed) {
            await Swal.fire({
                icon: "success",
                title: "Logged out",
                text: "You have been logged out successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
            handleLogout();
        }
    }

    const handleTaskToggle = (taskId) => {
        setTaskToggles((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const handleMarkCompleted = async (taskId) => {
        try {
            await MarkCompleted(taskId, "Completed");
            await fetchTasks();
            await Swal.fire({
                icon: "success",
                title: "Task Marked as Completed",
                text: "The task has been marked as completed successfully.",
                timer: 2000,
                showConfirmButton: false,
            });
            return true;
        } catch (error) {
            console.error("Error marking task as completed:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to mark task as completed. Please try again.",
            });
            return false;
        }
    }

    return (
        <div>
            <AddTask isOpen={addOpen} onClose={() => setAddOpen(false)} />
            <EditTask
                isOpen={editOpen}
                taskData={selectedTask}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedTask(null);
                }}
            />
            <AddUser isOpen={addUserOpen} onClose={() => setAddUserOpen(false)} />
            <div className="min-h-screen bg-[#f5efe8] pb-6 pt-0 font-sans relative overflow-hidden">
                <div className="absolute inset-0 -z-0"
                    style={{
                        background: `radial-gradient(circle at 95% 5%, rgba(207,232,243,0.9) 0%, rgba(207,232,243,0.6) 18%, rgba(207,232,243,0.25) 30%, transparent 45%),
                                    linear-gradient(135deg, rgba(245,239,232,1) 55%, rgba(235,244,248,0.4) 75%, rgba(220,236,244,0.5) 100%)`}} />
                {/* Header */}
                <div className="relative z-10">
                    <div className="mb-6 flex items-center justify-between gap-2 sm:gap-3 border-b border-[hsl(32_28%_84%/0.6)] bg-[hsl(28_33%_96%/0.75)] p-3 px-3.5">
                        <div className="flex items-center">

                            {/* Desktop Logo + Title */}
                            <div className="hidden lg:flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#f16022] flex items-center justify-center text-white font-bold">
                                    T
                                </div>
                                <div>
                                    <p className="text-xs text-gray-700 tracking-widest">WORKSPACE</p>
                                    <h1 className="text-xl font-semibold">TaskFlow</h1>
                                </div>
                            </div>

                            {/* Mobile Menu Icon */}
                            <button
                                className="lg:hidden text-2xl text-gray-800"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <FiMenu />
                            </button>
                        </div>

                        <div className="relative flex items-center gap-2 sm:gap-3">
                            <input
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-[180px] sm:w-[260px] lg:w-64 px-4 py-2 rounded-2xl bg-white shadow-sm outline-none"
                            />
                            {suggestions.length > 0 && (
                                <div className="absolute left-0 top-full z-20 mt-1 bg-white rounded-lg shadow-lg w-[180px] sm:w-[260px] lg:w-64 max-h-60 overflow-y-auto border border-gray-100">
                                    {suggestions.map((s, i) => (
                                        <div
                                            key={i}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            role="option"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => {
                                                setSearch(s);
                                                setSuggestions([]);
                                            }}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                className="shrink-0 bg-[#f16022] text-white px-3 sm:px-4 py-2 rounded-2xl shadow hover:bg-[#d84f18] transition-colors whitespace-nowrap text-sm sm:text-base"
                                onClick={() => setAddUserOpen(true)}
                            >
                                <span className="sm:hidden">+ Add</span>
                                <span className="hidden sm:inline">+ Add employee</span>
                            </button>
                            <div className="rounded-2xl border border-orange-100 bg-white/85 px-2 py-1.5 shadow-sm">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="h-9 w-9 rounded-full bg-[#f16022] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                        {userInitial}
                                    </div>
                                    <button
                                        type="button"
                                        className="h-6 w-6 rounded-md text-gray-600 hover:text-[#f16022] hover:bg-orange-50 transition-colors flex items-center justify-center"
                                        onClick={confirmLogout}
                                        aria-label="Logout"
                                        title="Logout"
                                    >
                                        <FiLogOut className="text-base" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <button className="bg-[#f16022] text-white px-4 py-2 rounded-2xl shadow w-full" onClick={() => setAddOpen(true)}>
                            + New Task
                        </button>

                        {[
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="text-xs text-gray-700 tracking-[3px]">{item.label}</p>
                                    <p className="text-2xl font-bold">{item.value}</p>
                                </div>
                                <div className={`${item.color} p-3 rounded-xl`} >
                                    {item.icon}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                        {displayedTasks.map((task, index) => (
                            (() => {
                                const isCompleted = (task.status || "").toLowerCase() === "completed";
                                const isSwitchOn = isCompleted || Boolean(taskToggles[task.taskId]);
                                return (
                                    <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border-b-4 border-orange-300">
                                        <div className="mb-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${task.priority === "High"
                                                        ? "text-red-600 bg-red-100 border border-red-600"
                                                        : task.priority === "Medium"
                                                            ? "text-yellow-600 bg-yellow-100 border border-yellow-600"
                                                            : "text-blue-600 bg-blue-100 border border-blue-600"
                                                        }`}>
                                                        {task.priority}
                                                    </span>
                                                    {isCompleted && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-700 font-semibold">
                                                            Completed
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-2 py-1">
                                                    <span className="text-xs font-semibold text-slate-700">Mark Completed</span>
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={isSwitchOn}
                                                        aria-label="Toggle task switch"
                                                        disabled={isCompleted}
                                                        onClick={async () => {
                                                            handleTaskToggle(task.taskId);
                                                            const isSuccess = await handleMarkCompleted(task.taskId);
                                                            if (!isSuccess) {
                                                                handleTaskToggle(task.taskId);
                                                            }
                                                        }}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 shadow-inner ${isSwitchOn
                                                            ? "bg-emerald-600"
                                                            : "bg-slate-300"
                                                            } ${isCompleted ? "cursor-not-allowed opacity-80" : ""}`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isSwitchOn
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            <span className="mt-2 inline-block text-xs text-gray-400">Due - {formatDate(task.dueDate)}</span>
                                        </div>

                                        <h3 className={`font-semibold text-lg ${isCompleted ? "text-emerald-700" : "text-gray-800"}`}>
                                            {task.title}
                                        </h3>
                                        <p className={`text-sm mt-1 ${isCompleted ? "text-emerald-700" : "text-gray-600"}`}>
                                            {task.description}
                                        </p>

                                        <div className="bg-[rgb(245,239,232)] border border-[#e2d7cb99] rounded-xl p-3 mt-4 text-sm text-gray-600">
                                            <p>Updated: {task.updatedAt ? formatDate(task.updatedAt) : "*"}</p>
                                            <p>Status: {task.status}</p>
                                            <p>Assigned To: {task.assignTo ? task.assignTo.name : "-"}</p>
                                        </div>
                                        {isCompleted && (
                                            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                                This task is completed.
                                            </div>
                                        )}

                                        {
                                            userRole === "admin" && (<div className="flex flex-col sm:flex-row gap-3 mt-4">
                                                <div>
                                                    <button className="w-full bg-[rgb(245,239,232)] border border-[#e2d7cb99] text-gray-700 font-semibold px-4 py-1 rounded-xl flex items-center justify-center gap-1"
                                                        onClick={() => handleEditClick(task)}
                                                    >
                                                        <MdOutlineEdit size={18} />
                                                        Edit
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="w-full bg-[rgb(245,239,232)] border border-[#e2d7cb99] text-gray-700 font-semibold px-4 py-1 rounded-xl flex items-center justify-center gap-1"
                                                        onClick={() => deleteTask(task.taskId)}
                                                    >
                                                        <HiOutlineTrash size={18} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>)
                                        }

                                    </div>
                                );
                            })()
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
