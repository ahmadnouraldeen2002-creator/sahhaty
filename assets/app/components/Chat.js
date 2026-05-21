import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { chatWithCoach } from '../services/geminiService.js';
const Chat = ({ userProfile, messages, onUpdateMessages, dietPlan, workoutPlan, t }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSend = async () => {
        if (!input.trim() || loading)
            return;
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };
        const newHistory = [...messages, userMsg];
        onUpdateMessages(newHistory);
        setInput('');
        setLoading(true);
        const responseText = await chatWithCoach(userMsg.text, newHistory, userProfile, dietPlan, workoutPlan);
        const botMsg = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };
        onUpdateMessages([...newHistory, botMsg]);
        setLoading(false);
    };
    return (_jsxs("div", { className: "flex flex-col h-full bg-gray-50", children: [_jsx("div", { className: "bg-white p-4 shadow-sm border-b sticky top-0 z-10 shrink-0", children: _jsx("h2", { className: "text-lg font-bold text-teal-800", children: t.chatTitle }) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", ref: scrollRef, children: [messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`, children: _jsx("div", { className: `max-w-[85%] md:max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-teal-500 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`, children: msg.text }) }, msg.id))), loading && (_jsx("div", { className: "flex justify-end", children: _jsxs("div", { className: "bg-white border p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }), _jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" }), _jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" })] }) }))] }), _jsx("div", { className: "p-4 bg-white border-t shrink-0", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: e => setInput(e.target.value), onKeyDown: e => e.key === 'Enter' && handleSend(), placeholder: t.typeMessage, className: "flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-teal-300 transition-all" }), _jsx("button", { onClick: handleSend, disabled: loading || !input.trim(), className: "bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow hover:bg-teal-700 disabled:opacity-50 transition-colors", children: "\u27A4" })] }) })] }));
};
export default Chat;
