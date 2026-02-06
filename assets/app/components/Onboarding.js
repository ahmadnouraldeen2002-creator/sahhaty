import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { generateInitialPlan } from '../services/geminiService.js';
const Onboarding = ({ onComplete, language, setLanguage, t }) => {
    const [step, setStep] = useState(0); // Start at Step 0 for Terms
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
        age: 25,
        height: 170,
        weight: 70,
        gender: 'male',
        activityLevel: 'moderate',
        goal: 'lose_weight',
        dietaryRestrictions: [],
        budget: 'standard',
        timeConstraint: 'normal',
        language: 'English',
        workStart: '08:00',
        workEnd: '17:00',
        hasLunchBreak: true,
        breakTime: '13:00',
        employmentStatus: 'full_time',
        hasChildren: false
    });
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('avatar', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleFinish = async () => {
        setLoading(true);
        try {
            const profile = formData;
            // Force profile language to match UI selected language
            if (language === 'ar')
                profile.language = 'Arabic';
            else if (language === 'fr')
                profile.language = 'French';
            else
                profile.language = 'English';
            const plans = await generateInitialPlan(profile);
            if (!plans || !plans.dietPlan || !plans.workoutPlan) {
                throw new Error("Invalid plan data received");
            }
            onComplete(profile, plans.dietPlan, plans.workoutPlan);
        }
        catch (e) {
            console.error("Onboarding Error:", e);
            alert(language === 'ar' ? "حدث خطأ. حاول مرة أخرى." : "Error occurred. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    // INCREASED CONTRAST: darker background (gray-100), darker border (gray-300), darker placeholder
    const inputClass = "w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-900 font-bold focus:bg-white focus:border-blue-600 focus:ring-0 outline-none transition placeholder-gray-500";
    // STRICT FIX: Inline style guarantees overriding any global font family (like Cairo)
    // This ensures inputs always use Western digits (0-9)
    const westernNumStyle = {
        fontFamily: 'Arial, Helvetica, sans-serif',
        direction: 'ltr',
        textAlign: 'left'
    };
    const labelClass = "block text-gray-800 text-sm font-extrabold mb-2";
    const dietTags = [
        { key: 'Vegetarian', label: t.dietVeg },
        { key: 'Gluten Free', label: t.dietGluten },
        { key: 'Lactose Free', label: t.dietLactose },
        { key: 'No Sugar', label: t.dietSugar },
        { key: 'Keto', label: t.dietKeto }
    ];
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-800 to-blue-900 p-4", children: _jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative overflow-hidden border-4 border-white/10", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600" }), loading ? (_jsxs("div", { className: "text-center py-12", children: [_jsxs("div", { className: "relative w-24 h-24 mx-auto mb-8", children: [_jsx("div", { className: "absolute inset-0 border-t-4 border-blue-600 border-solid rounded-full animate-spin" }), _jsx("div", { className: "absolute inset-3 border-b-4 border-teal-500 border-solid rounded-full animate-spin reverse" })] }), _jsx("h2", { className: "text-2xl font-black text-gray-900 mb-3", children: t.loading })] })) : (_jsxs(_Fragment, { children: [step > 0 && (_jsx("div", { className: "mb-8", children: _jsx("div", { className: "flex justify-between mb-4 px-2", children: [1, 2, 3].map(i => (_jsx("div", { className: `h-3 flex-1 rounded-full mx-1 transition-all duration-500 ${i <= step ? 'bg-blue-600 shadow-md' : 'bg-gray-200'}` }, i))) }) })), _jsxs("div", { className: "animate-fade-in-up", children: [step === 0 && (_jsxs("div", { className: "space-y-6 text-center", children: [_jsx("h1", { className: "text-4xl font-black text-slate-900 tracking-tight", children: "SAHHATY" }), _jsx("p", { className: "text-gray-600 font-bold mb-6 text-lg", children: "Smart Health Coach" }), _jsxs("div", { className: "bg-gray-100 p-5 rounded-2xl border-2 border-gray-200", children: [_jsx("label", { className: `${labelClass} text-left`, children: t.onbLang || "Select Language" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setLanguage('ar'), className: `flex-1 py-3 rounded-xl font-bold border-2 transition-all ${language === 'ar' ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`, children: "\u0639\u0631\u0628\u064A" }), _jsx("button", { onClick: () => setLanguage('en'), className: `flex-1 py-3 rounded-xl font-bold border-2 transition-all ${language === 'en' ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`, children: "English" }), _jsx("button", { onClick: () => setLanguage('fr'), className: `flex-1 py-3 rounded-xl font-bold border-2 transition-all ${language === 'fr' ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`, children: "Fran\u00E7ais" })] })] }), _jsxs("div", { className: "bg-white border-2 border-red-200 p-5 rounded-2xl text-left h-64 overflow-y-auto custom-scrollbar shadow-inner", children: [_jsxs("h3", { className: "font-black text-red-600 mb-3 flex items-center gap-2 text-lg", children: ["\u26A0\uFE0F ", t.termsTitle] }), _jsx("p", { className: "text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-semibold", children: t.termsText })] }), _jsx("button", { onClick: () => { setAcceptedTerms(true); nextStep(); }, className: "w-full py-4 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-black transition font-bold text-lg hover:shadow-xl transform hover:-translate-y-0.5", children: t.btnAgree })] })), step === 1 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col items-center mb-6", children: [_jsxs("div", { className: "relative group cursor-pointer", children: [_jsx("div", { className: "w-28 h-28 rounded-full bg-gray-100 border-4 border-gray-200 shadow-lg overflow-hidden flex items-center justify-center hover:border-blue-400 transition", children: formData.avatar ? (_jsx("img", { src: formData.avatar, alt: "Profile", className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-4xl", children: "\uD83D\uDCF7" })) }), _jsxs("label", { className: "absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md", children: [_jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleImageUpload }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) })] })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2 font-bold", children: t.lblUploadPhoto })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.onbName }), _jsx("input", { type: "text", value: formData.name, onChange: e => handleChange('name', e.target.value), className: inputClass })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.onbAge }), _jsx("input", { type: "text", style: westernNumStyle, lang: "en", value: formData.age, onChange: e => handleChange('age', Number(e.target.value)), className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.onbGender }), _jsxs("select", { value: formData.gender, onChange: e => handleChange('gender', e.target.value), className: inputClass, children: [_jsx("option", { value: "male", children: t.optMale }), _jsx("option", { value: "female", children: t.optFemale })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.onbHeight }), _jsx("input", { type: "text", style: westernNumStyle, lang: "en", value: formData.height, onChange: e => handleChange('height', Number(e.target.value)), className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.onbWeight }), _jsx("input", { type: "text", style: westernNumStyle, lang: "en", value: formData.weight, onChange: e => handleChange('weight', Number(e.target.value)), className: inputClass })] })] })] })), step === 2 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.lblEmployment }), _jsxs("select", { value: formData.employmentStatus, onChange: e => handleChange('employmentStatus', e.target.value), className: inputClass, children: [_jsx("option", { value: "full_time", children: t.empFullTime }), _jsx("option", { value: "part_time", children: t.empPartTime }), _jsx("option", { value: "homemaker", children: t.empHomemaker }), _jsx("option", { value: "student", children: t.empStudent }), _jsx("option", { value: "unemployed", children: t.empUnemployed })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.lblChildren }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: () => handleChange('hasChildren', true), className: `flex-1 p-3 rounded-xl border-2 font-bold transition-all ${formData.hasChildren ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`, children: t.yes }), _jsx("button", { onClick: () => handleChange('hasChildren', false), className: `flex-1 p-3 rounded-xl border-2 font-bold transition-all ${!formData.hasChildren ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`, children: t.no })] })] }), _jsxs("div", { className: "bg-blue-50 p-5 rounded-2xl border-2 border-blue-200", children: [_jsxs("label", { className: "block text-blue-900 mb-4 font-black text-lg flex items-center gap-2", children: [_jsx("span", { children: "\u23F0" }), " ", t.onbWorkStart, " / ", t.onbWorkEnd] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-bold text-gray-700 mb-1 block", children: t.lblStart }), _jsx("input", { type: "text", placeholder: "08:00", dir: "ltr", value: formData.workStart, onChange: e => handleChange('workStart', e.target.value), className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-bold text-gray-700 mb-1 block", children: t.lblEnd }), _jsx("input", { type: "text", placeholder: "17:00", dir: "ltr", value: formData.workEnd, onChange: e => handleChange('workEnd', e.target.value), className: inputClass })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-blue-100 cursor-pointer hover:border-blue-300 transition", children: [_jsx("input", { type: "checkbox", id: "break", checked: formData.hasLunchBreak, onChange: e => handleChange('hasLunchBreak', e.target.checked), className: "w-6 h-6 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" }), _jsx("label", { htmlFor: "break", className: "text-gray-900 text-sm font-bold cursor-pointer select-none flex-1", children: t.onbLunchBreak })] }), formData.hasLunchBreak && (_jsxs("div", { className: "animate-fade-in-up", children: [_jsx("label", { className: "text-sm font-bold text-gray-700 mb-1 block", children: t.onbBreakTime }), _jsx("input", { type: "text", placeholder: "13:00", dir: "ltr", value: formData.breakTime, onChange: e => handleChange('breakTime', e.target.value), className: inputClass })] }))] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.lblActivityLevel }), _jsx("div", { className: "grid grid-cols-1 gap-3", children: [
                                                        { val: 'sedentary', label: t.actSedentary },
                                                        { val: 'light', label: t.actLight },
                                                        { val: 'moderate', label: t.actModerate },
                                                        { val: 'active', label: t.actActive }
                                                    ].map((opt) => (_jsx("button", { onClick: () => handleChange('activityLevel', opt.val), className: `p-4 rounded-xl border-2 flex justify-between items-center transition-all ${formData.activityLevel === opt.val
                                                            ? 'bg-slate-800 text-white border-slate-800 shadow-lg transform scale-[1.02]'
                                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`, children: _jsx("span", { className: "font-bold text-lg", children: opt.label }) }, opt.val))) })] })] })), step === 3 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.onbGoal }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("button", { onClick: () => handleChange('goal', 'lose_weight'), className: `p-4 rounded-xl border-2 text-sm font-bold transition-all ${formData.goal === 'lose_weight' ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'}`, children: ["Lose \uD83D\uDD25", _jsx("br", {}), _jsx("span", { className: "text-[10px]", children: t.goalLose })] }), _jsxs("button", { onClick: () => handleChange('goal', 'maintain'), className: `p-4 rounded-xl border-2 text-sm font-bold transition-all ${formData.goal === 'maintain' ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'}`, children: ["Health \uD83C\uDF3F", _jsx("br", {}), _jsx("span", { className: "text-[10px]", children: t.goalMaintain })] }), _jsxs("button", { onClick: () => handleChange('goal', 'gain_weight'), className: `p-4 rounded-xl border-2 text-sm font-bold transition-all ${formData.goal === 'gain_weight' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'}`, children: ["Gain \uD83D\uDCAA", _jsx("br", {}), _jsx("span", { className: "text-[10px]", children: t.goalGain })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.onbBudget }), _jsxs("select", { value: formData.budget, onChange: e => handleChange('budget', e.target.value), className: inputClass, children: [_jsx("option", { value: "standard", children: t.budStandard }), _jsx("option", { value: "low", children: t.budLow })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: t.lblDietOptional }), _jsx("div", { className: "flex flex-wrap gap-2", children: dietTags.map(tagObj => (_jsx("button", { onClick: () => {
                                                            const current = formData.dietaryRestrictions || [];
                                                            if (current.includes(tagObj.key)) {
                                                                handleChange('dietaryRestrictions', current.filter(t => t !== tagObj.key));
                                                            }
                                                            else {
                                                                handleChange('dietaryRestrictions', [...current, tagObj.key]);
                                                            }
                                                        }, className: `px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${formData.dietaryRestrictions?.includes(tagObj.key)
                                                            ? 'bg-slate-800 text-white border-slate-800'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`, children: tagObj.label }, tagObj.key))) })] })] }))] }), _jsxs("div", { className: "mt-10 flex justify-between items-center", children: [step > 1 ? (_jsx("button", { onClick: prevStep, className: "px-6 py-3 text-gray-500 font-bold hover:text-gray-900 transition underline", children: t.btnBack })) : _jsx("div", {}), step > 0 && step < 3 && (_jsxs("button", { onClick: nextStep, className: "px-10 py-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-black transition font-bold flex items-center gap-2", children: [_jsx("span", { children: t.btnNext }), _jsx("span", { children: "\u2192" })] })), step === 3 && (_jsx("button", { onClick: handleFinish, className: "px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform font-black text-lg w-full md:w-auto", children: t.btnCreate }))] })] }))] }) }));
};
export default Onboarding;
