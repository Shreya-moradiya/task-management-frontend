import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "./RegisterService/RegistrationService";

const emptyForm = {
  companyName: "",
  name: "",
  email: "",
  password: "",
};

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError((prev) => {
      const key = e.target.name;
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName?.trim()) newErrors.companyName = "Company name is required";
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

    setLoading(true);
    setError({});
    try {
      await Register(formData);
      setFormData(emptyForm);
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      setError({ submit: typeof msg === "string" ? msg : "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: `radial-gradient(circle at 95% 5%, rgba(207,232,243,0.9) 0%, rgba(207,232,243,0.6) 18%, rgba(207,232,243,0.25) 30%, transparent 45%),
              linear-gradient(135deg, rgba(245,239,232,1) 55%, rgba(235,244,248,0.4) 75%, rgba(220,236,244,0.5) 100%)`}}
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-stone-500">Register to start managing your tasks</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {error.submit && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">
              {error.submit}
            </p>
          )}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-stone-700 mb-2">
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              placeholder="e.g. Company Name"
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl bg-stone-50 border text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow ${
                error.companyName ? "border-red-300" : "border-stone-200"
              }`}
            />
            {error.companyName && (
              <p className="mt-1 text-sm text-red-600">{error.companyName}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
              Admin Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              placeholder="e.g. admin"
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl bg-stone-50 border text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow ${
                error.name ? "border-red-300" : "border-stone-200"
              }`}
            />
            {error.name && <p className="mt-1 text-sm text-red-600">{error.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="e.g. admin@company.com"
              onChange={handleChange}
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl bg-stone-50 border text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow ${
                error.email ? "border-red-300" : "border-stone-200"
              }`}
            />
            {error.email && <p className="mt-1 text-sm text-red-600">{error.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              placeholder="••••••••"
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full px-4 py-3 rounded-xl bg-stone-50 border text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow ${
                error.password ? "border-red-300" : "border-stone-200"
              }`}
            />
            {error.password && <p className="mt-1 text-sm text-red-600">{error.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#f16022] text-white font-semibold hover:bg-[#d84f18] focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:ring-offset-2 focus:ring-offset-white transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;