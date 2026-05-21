import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const Auth = ({ onLogin }) => {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        birthDate: "",
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleLogin = () => {
        if (!form.email || !form.password) {
            alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
            return;
        }
        // Simulate login
        onLogin();
    };
    const handleRegister = () => {
        if (!form.email || !form.password || !form.firstName || !form.lastName) {
            alert("يرجى تعبئة جميع الحقول");
            return;
        }
        alert("تم إنشاء الحساب بنجاح ✅ يمكنك تسجيل الدخول الآن");
        setMode("login");
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4 w-full", dir: "rtl", children: [_jsxs("div", { className: "w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-black/5", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-black text-slate-900", children: "SAHHATY" }), _jsx("p", { className: "text-sm text-gray-500 font-bold mt-1", children: mode === "login"
                                    ? "سجّل دخولك لمتابعة رحلتك الصحية"
                                    : "أنشئ حسابك وابدأ رحلتك الصحية" })] }), mode === "register" && (_jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [_jsx("input", { name: "firstName", placeholder: "\u0627\u0644\u0627\u0633\u0645", value: form.firstName, onChange: handleChange, className: "auth-input" }), _jsx("input", { name: "lastName", placeholder: "\u0627\u0644\u0644\u0642\u0628", value: form.lastName, onChange: handleChange, className: "auth-input" })] })), mode === "register" && (_jsx("input", { type: "date", name: "birthDate", value: form.birthDate, onChange: handleChange, className: "auth-input mb-4" })), _jsx("input", { type: "email", name: "email", placeholder: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A", value: form.email, onChange: handleChange, className: "auth-input mb-4" }), _jsx("input", { type: "password", name: "password", placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631", value: form.password, onChange: handleChange, className: "auth-input mb-6" }), mode === "login" ? (_jsx("button", { onClick: handleLogin, className: "auth-btn-primary", children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" })) : (_jsx("button", { onClick: handleRegister, className: "auth-btn-primary", children: "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628" })), _jsx("div", { className: "text-center mt-6", children: mode === "login" ? (_jsx("button", { onClick: () => setMode("register"), className: "text-sm font-bold text-emerald-600 hover:underline", children: "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F \u0623\u0646\u0634\u0626 \u062D\u0633\u0627\u0628\u064B\u0627" })) : (_jsx("button", { onClick: () => setMode("login"), className: "text-sm font-bold text-slate-600 hover:underline", children: "\u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" })) })] }), _jsx("style", { children: `
          .auth-input {
            width: 100%;
            padding: 14px;
            border-radius: 14px;
            border: 2px solid #e5e7eb;
            font-weight: 700;
            background: #f9fafb;
            outline: none;
            color: #1f2937;
          }
          .auth-input:focus {
            border-color: #10b981;
            background: white;
          }
          .auth-btn-primary {
            width: 100%;
            padding: 16px;
            border-radius: 16px;
            background: linear-gradient(to right, #10b981, #059669);
            color: white;
            font-weight: 900;
            font-size: 16px;
            box-shadow: 0 10px 25px rgba(16,185,129,0.35);
            transition: all .3s;
          }
          .auth-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(16,185,129,0.45);
          }
        ` })] }));
};
export default Auth;
