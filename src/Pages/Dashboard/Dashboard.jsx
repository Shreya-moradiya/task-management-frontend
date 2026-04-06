import { useNavigate } from "react-router-dom";
import { GetTask } from "./Services/DashboardService";
import { useEffect, useState } from "react";

function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function getPriorityTagClass(priority) {
    const p = (priority || "").toLowerCase();
    if (p === "high") return "bg-tf-high-bg text-tf-high-text";
    if (p === "medium") return "bg-tf-medium-bg text-tf-medium-text";
    return "bg-tf-low-bg text-tf-low-text";
}

function getStatusTagClass(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("progress")) return "bg-tf-progress-bg text-tf-progress-text";
    if (s === "completed" || s === "done") return "bg-tf-completed-bg text-tf-completed-text";
    return "bg-tf-todo-bg text-tf-todo-text";
}

function getStatusLabel(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("progress")) return "IN PROGRESS";
    if (s === "completed" || s === "done") return "COMPLETED";
    return "TO DO";
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

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

    useEffect(() => { fetchTasks(); }, []);

    const total = tasks.length;
    const toDo = tasks.filter((t) => (t.status || "").toLowerCase() === "pending" || (t.status || "").toLowerCase() === "to do").length;
    const inProgress = tasks.filter((t) => (t.status || "").toLowerCase().includes("progress")).length;
    const completed = tasks.filter((t) => (t.status || "").toLowerCase() === "completed" || (t.status || "").toLowerCase() === "done").length;
    const openCount = toDo + inProgress;

    return (
        <div>
            <div className="min-h-screen bg-[#f5efe8] pb-6 pt-0 font-sans relative overflow-hidden">
                {/* Global background shade like design (subtle diagonal sky tint) */}
                <div className="absolute inset-0 -z-0"
                    style={{
                        background: `
            radial-gradient(circle at 95% 5%, rgba(207,232,243,0.9) 0%, rgba(207,232,243,0.6) 18%, rgba(207,232,243,0.25) 30%, transparent 45%),
            linear-gradient(135deg, rgba(245,239,232,1) 55%, rgba(235,244,248,0.4) 75%, rgba(220,236,244,0.5) 100%)
          `
                    }}

                />
                {/* Header */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6 p-3 border-b border-[hsl(32_28%_84%/0.6)] bg-[hsl(28_33%_96%/0.75)] px-60">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f16022] flex items-center justify-center text-white font-bold">
                                T
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 tracking-widest">WORKSPACE</p>
                                <h1 className="text-xl font-semibold">TaskFlow</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                placeholder="Search tasks..."
                                className="px-4 py-2 rounded-2xl bg-white shadow-sm outline-none w-64"
                            />
                            <button className="bg-[#f16022] text-white px-4 py-2 rounded-2xl shadow">
                                + New Task
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 px-60">
                    {/* Hero */}
                    <div className="bg-[#fff] rounded-3xl p-8 flex justify-between items-center shadow-[0_28px_70px_#422e2429] backdrop-blur-sm">
                        <div className="max-w-xl">
                            <p className="text-xs tracking-widest text-gray-400 mb-2">
                                TASK COMMAND CENTER
                            </p>
                            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                                Make daily work feel organized, fast, and beautiful.
                            </h2>
                            <p className="text-gray-500 mt-4">
                                Track every task field clearly with a dashboard that feels more premium and easier to scan.
                            </p>
                        </div>

                        <div className="bg-[#FAF3EB] bg-background/60 rounded-2xl px-8 py-3 shadow-sm flex gap-32 justify-center">
                            <div>
                                <p className="text-xs text-gray-400">OPEN</p>
                                <p className="text-2xl font-bold">3</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">DONE</p>
                                <p className="text-2xl font-bold">1</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        {[
                            { label: "TOTAL TASKS", value: 4, color: "bg-[#f16022]" },
                            { label: "TO DO", value: 1, color: "bg-[#1E94B7]" },
                            { label: "IN PROGRESS", value: 2, color: "bg-[#f16022]" },
                            { label: "COMPLETED", value: 1, color: "bg-gradient-to-br from-[#1e8fb8] to-[#3184e3]" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="text-xs text-gray-400">{item.label}</p>
                                    <p className="text-2xl font-bold">{item.value}</p>
                                </div>
                                <div className={`${item.color} w-10 h-10 rounded-xl`} />
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-full p-2 flex gap-2 mt-6 w-fit shadow-sm">
                        <button className="bg-[#f16022] text-white px-4 py-2 rounded-full">
                            All Tasks
                        </button>
                        <button className="px-4 py-2 bg-[#1E94B7] text-white">To Do</button>
                        <button className="px-4 py-2 text-gray-500">In Progress</button>
                        <button className="px-4 py-2 text-gray-500">Completed</button>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-3 gap-6 mt-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border-b-4 border-orange-300">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">
                                        HIGH
                                    </span>
                                    <span className="text-xs text-gray-400">Due 2026-03-20</span>
                                </div>

                                <h3 className="font-semibold text-lg text-gray-800">
                                    Prepare weekly sales report
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Collect and summarize sales data for the last week.
                                </p>

                                <div className="bg-gray-50 rounded-xl p-3 mt-4 text-sm text-gray-400">
                                    <p>Updated: —</p>
                                    <p>Status: Pending</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
