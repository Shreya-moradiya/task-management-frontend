import React, { useEffect, useState } from 'react'
import { AddTaskServices, GetAllUsers } from './Services/AddTaskServices';
import Swal from 'sweetalert2';

const AddTask = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Low",
        status: "Pending",
        dueDate: "",
        assignTo: "",
        comments: ""
    });
    const [user, SetUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddTask = async () => {
        if (!formData.title.trim()) {
            alert("Title is required");
            return;
        }

        setLoading(true);
        try {
            const response = await AddTaskServices(formData);
            console.log("Task created successfully:", response);
            setFormData({
                title: "",
                description: "",
                priority: "Low",
                status: "Pending",
                dueDate: "",
                assignTo: "",
                comments: ""
            });

            Swal.fire({
                icon: 'success',
                title: 'Task Created',
                text: 'Your task has been created successfully!',
                confirmButtonColor: '#f16022',
                timer:2000,
                showConfirmButton: false,
            })

            onClose();
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'There was an error creating the task. Please try again.',
                confirmButtonColor: '#f16022'
            })
            console.error("Error creating task:", error);
        }
    }

    const GetUsers = async () => {
        try {
            const response = await GetAllUsers();
            SetUser(response?.data ?? response);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    useEffect(() => {
        GetUsers();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Create New Task</h3>
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
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Brief description..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Assign To</label>
                            <select
                                type="text"
                                name="assignTo"
                                // placeholder="Name..."
                                // placeholder="Name..."
                                value={formData.assignTo}
                                onChange={(e) => {
                                    setFormData((prev) => ({ ...prev, assignTo: e.target.value }));
                                }}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option value="">Select user</option>
                                {user.data.map((u) => (
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
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleAddTask}
                        className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-5 py-2 rounded-md hover:brightness-110 transition"
                    >
                        Create Task
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
        </div>
    )
}

export default AddTask