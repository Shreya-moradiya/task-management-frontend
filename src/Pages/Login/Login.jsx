import { useState } from "react";
import { LoginService } from "./Services/LoginService";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
        rememberMe: false,
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await LoginService(formData);

            if (response?.token) {
                localStorage.setItem("authToken", response.token);
            }

            const companyId =
                response?.companyId ??
                response?.companyID ??
                response?.user?.companyId ??
                response?.user?.companyID;
            if (companyId != null && String(companyId).trim() !== "") {
                localStorage.setItem("companyId", String(companyId));
            }

            const userName =
                response?.name ??
                response?.user?.name ??
                response?.fullName ??
                response?.user?.fullName;
            if (userName && String(userName).trim() !== "") {
                localStorage.setItem("userName", String(userName).trim());
            }

            const userRole =
                response?.role ??
                response?.user?.role ??
                response?.user?.roles ??
                (response?.user?.roles && Array.isArray(response.user.roles)
                    ? response.user.roles[0]
                    : null);
            if (userRole && String(userRole).trim() !== "") {
                localStorage.setItem("userRole", String(userRole).trim());
            }

            setFormData((prev) => ({ ...prev, password: "", email: "", role: "", rememberMe: false, ...response }));
            // setFormData(response)
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{
                background: `radial-gradient(circle at 95% 5%, rgba(207,232,243,0.9) 0%, rgba(207,232,243,0.6) 18%, rgba(207,232,243,0.25) 30%, transparent 45%),
                                    linear-gradient(135deg, rgba(245,239,232,1) 55%, rgba(235,244,248,0.4) 75%, rgba(220,236,244,0.5) 100%)`,
            }}
        >

            <div className="relative w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-xl border border-[#f16022]/25 rounded-2xl shadow-xl shadow-[#f16022]/10 p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-stone-500 text-sm">
                            Sign in to your task management account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-[#f16022] hover:text-[#d84f18] transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-stone-700 mb-2">
                                Role
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:border-[#f16022] transition-shadow appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2378756e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: "right 0.75rem center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "1.5em 1.5em",
                                    paddingRight: "2.5rem",
                                }}
                            >
                                <option value="" disabled className="bg-white text-stone-500">Select your role</option>
                                <option value="admin" className="bg-white text-stone-800">Admin</option>
                                <option value="employee" className="bg-white text-stone-800">Employee User</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                className="h-4 w-4 rounded border-stone-300 bg-stone-50 text-[#f16022] focus:ring-[#f16022] focus:ring-offset-0"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-600">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-xl bg-[#f16022] text-white font-semibold hover:bg-[#d84f18] focus:outline-none focus:ring-2 focus:ring-[#f16022] focus:ring-offset-2 focus:ring-offset-white transition-colors shadow-md"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-stone-500">
                        Don&apos;t have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/registration")}
                            className="font-medium text-[#f16022] hover:text-[#d84f18] transition-colors"
                        >
                            Sign up
                        </button>
                    </p>
                </div>

                {/* <p className="mt-6 text-center text-xs text-stone-400">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p> */}
            </div>
        </div>
    );
}
