import React, { useEffect, useState } from 'react'
import { GetAllUsers } from '../AddTask/Services/AddTaskServices';
import { UpdateTask } from './Services/EditTaskServices';
import Swal from 'sweetalert2';

const EditTask = ({ isOpen, onClose, taskData }) => {
    const [formData, setFormData] = useState({
        taskId: "",
        title: "",
        description: "",
        priority: "",
        status: "",
        dueDate: "",
        assignTo: "",
        comments: ""
    });
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(false);

    const GetUser = async () => {
        try {
            const response = await GetAllUsers();
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    useEffect(() => {
        GetUser();
    }, []);

    useEffect(() => {
        if (!taskData) return;
        setFormData({
            taskId: taskData?.taskId ?? "",
            title: taskData?.title ?? "",
            description: taskData?.description ?? "",
            priority: taskData?.priority ?? "",
            status: taskData?.status ?? "",
            dueDate: taskData?.dueDate ? String(taskData.dueDate).slice(0, 10) : "",
            assignTo: taskData?.assignTo ?? "",
            comments: taskData?.comments ?? ""
        });
        setSelectedUser(taskData?.assignTo ?? "");
    }, [taskData]);

    const handleUpdateTask = async () => {
        const resultSwal = await Swal.fire({
            icon: "question",
            title: "Update Task?",
            text: "Do you want to save changes?",
            showCancelButton: true,
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#f16022",
            cancelButtonColor: "#d33",
        });
        if (!resultSwal.isConfirmed) return;
        try {
            const response = await UpdateTask(formData.taskId, formData);
            console.log("Task updated successfully:", response);

            await Swal.fire({
                icon: "success",
                title: "Task Updated",
                text:"Your task has been updated successfully!",
                timer: 2000,
                showConfirmButton: false,
            })

            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: "Update Failed",
                text: "There was an error updating the task. Please try again."
            })
            console.error("Error updating task:", error);
        }
    }

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Update Task</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 text-xl font-bold"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Task title..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Brief description..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Assign To</label>
                            <select
                                type="text"
                                name="assignTo"
                                // placeholder="Name..."
                                value={formData.assignTo}
                                onChange={(e) => setFormData((prev) => ({ ...prev, assignTo: e.target.value }))}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                {Array.isArray(user.data) && user.data.length > 0 && user.data.map((u) => (
                                    <option key={u.userId} value={u.userId}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Comments</label>
                        <input
                            type="text"
                            name="comments"
                            placeholder="Additional notes..."
                            value={formData.comments}
                            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleUpdateTask}
                        className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-5 py-2 rounded-md hover:brightness-110 transition"
                    >
                        Update Task
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div >
    )
}

export default EditTask