import React, { useState } from "react";
import { AddUserService } from "./Services/AddUserService";

const AddUser = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => {
      if (!prev[name] && !prev.submit) return prev;
      const next = { ...prev };
      delete next[name];
      if (prev.submit) delete next.submit;
      return next;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const companyId = localStorage.getItem("companyId")?.trim();

    setLoading(true);
    setError({});
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "employee",
        ...(companyId ? { companyId } : {}),
      };
      await AddUserService(payload);
      setFormData({ name: "", email: "", password: "" });
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Could not add user. Check the API URL and server logs.";
      setError({ submit: typeof msg === "string" ? msg : "Could not add user. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="flex-1 text-center sm:text-left">
              <div className="mx-auto sm:mx-0 mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f16022]/10 text-[#f16022] text-lg font-bold">
                +
              </div>
              <h2 id="add-user-title" className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
                Add employee
              </h2>
              <p className="mt-1 text-sm text-stone-500">Create an employee account for your workspace</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-stone-400 hover:text-stone-700 text-2xl leading-none font-light"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {error.submit && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">
                {error.submit}
              </p>
            )}
            <div>
              <label htmlFor="addUser-name" className="block text-sm font-medium text-stone-700 mb-1.5">
                Full name
              </label>
              <input
                id="addUser-name"
                name="name"
                type="text"
                value={formData.name}
                placeholder="e.g. Jane Cooper"
                onChange={handleChange}
                autoComplete="name"
                className={`w-full px-4 py-2.5 rounded-xl bg-stone-50 border text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow ${
                  error.name ? "border-red-300" : "border-stone-200"
                }`}
              />
              {error.name && <p className="mt-1 text-sm text-red-600">{error.name}</p>}
            </div>

            <div>
              <label htmlFor="addUser-email" className="block text-sm font-medium text-stone-700 mb-1.5">
                Email Address
              </label>
              <input
                id="addUser-email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="e.g. name@company.com"
                onChange={handleChange}
                autoComplete="email"
                className={`w-full px-4 py-2.5 rounded-xl bg-stone-50 border text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow ${
                  error.email ? "border-red-300" : "border-stone-200"
                }`}
              />
              {error.email && <p className="mt-1 text-sm text-red-600">{error.email}</p>}
            </div>

            <div className="rounded-xl border border-[#f16022]/20 bg-gradient-to-br from-[#f16022]/[0.06] to-stone-50 px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#f16022] mb-2">
                Account type
              </p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-800">Employee</p>
                  <p className="mt-0.5 text-xs text-stone-500 leading-snug">
                    This form only adds employee users. Admin accounts are not created here.
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-white/90 border border-stone-200/80 px-2.5 py-1 text-xs font-medium text-stone-600 shadow-sm">
                  Employee
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="addUser-password" className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                id="addUser-password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="••••••••"
                onChange={handleChange}
                autoComplete="new-password"
                className={`w-full px-4 py-2.5 rounded-xl bg-stone-50 border text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow ${
                  error.password ? "border-red-300" : "border-stone-200"
                }`}
              />
              {error.password && <p className="mt-1 text-sm text-red-600">{error.password}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 font-semibold hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#f16022] text-white font-semibold hover:bg-[#d84f18] focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:ring-offset-2 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Adding…" : "Add employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
