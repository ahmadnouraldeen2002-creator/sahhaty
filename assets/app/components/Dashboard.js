import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { toLocalNum } from '../utils/translations.js';
const Dashboard = ({ data, onUpdateWater, onReset, language, setLanguage, t }) => {
    const { userProfile, dietPlan, workoutPlan, waterIntake, dailyProgress } = data;
    if (!userProfile || !dietPlan || !workoutPlan)
        return null;
    // Calculations
    const heightM = userProfile.height / 100;
    const bmi = userProfile.weight / (heightM * heightM);
    const optimalWeight = 22 * heightM * heightM;
    const weightDifference = Math.abs(userProfile.weight - optimalWeight);
    let statusText = '';
    let statusColor = '';
    let adviceMessage = '';
    let progressColor = '';
    if (bmi < 18.5) {
        statusText = language === 'ar' ? "نحافة" : "Underweight";
        statusColor = "text-blue-600 bg-blue-100";
        progressColor = "bg-blue-500";
        adviceMessage = language === 'ar'
            ? `للوصول للوزن المثالي (${toLocalNum(optimalWeight.toFixed(1), language)} كغ)، تحتاج لكسب ${toLocalNum(weightDifference.toFixed(1), language)} كغ.`
            : `To reach ideal weight (${toLocalNum(optimalWeight.toFixed(1), language)} kg), you need to gain ${toLocalNum(weightDifference.toFixed(1), language)} kg.`;
    }
    else if (bmi >= 18.5 && bmi < 25) {
        statusText = language === 'ar' ? "وزن مثالي" : "Ideal Weight";
        statusColor = "text-green-600 bg-green-100";
        progressColor = "bg-green-500";
        adviceMessage = language === 'ar'
            ? "وزنك ممتاز جداً! حافظ على هذا المستوى."
            : "Your weight is perfect! Keep it up.";
    }
    else if (bmi >= 25 && bmi < 30) {
        statusText = language === 'ar' ? "وزن زائد" : "Overweight";
        statusColor = "text-orange-600 bg-orange-100";
        progressColor = "bg-orange-500";
        adviceMessage = language === 'ar'
            ? `للوصول للوزن المثالي (${toLocalNum(optimalWeight.toFixed(1), language)} كغ)، تحتاج لخسارة ${toLocalNum(weightDifference.toFixed(1), language)} كغ.`
            : `To reach ideal weight (${toLocalNum(optimalWeight.toFixed(1), language)} kg), you need to lose ${toLocalNum(weightDifference.toFixed(1), language)} kg.`;
    }
    else {
        statusText = language === 'ar' ? "سمنة" : "Obese";
        statusColor = "text-red-600 bg-red-100";
        progressColor = "bg-red-500";
        adviceMessage = language === 'ar'
            ? `للوصول للوزن المثالي (${toLocalNum(optimalWeight.toFixed(1), language)} كغ)، يجب عليك خسارة ${toLocalNum(weightDifference.toFixed(1), language)} كغ.`
            : `To reach ideal weight (${toLocalNum(optimalWeight.toFixed(1), language)} kg), you must lose ${toLocalNum(weightDifference.toFixed(1), language)} kg.`;
    }
    const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'];
    const nextMealKey = mealOrder.find(key => !dailyProgress.completedMeals.includes(key));
    const displayMealKey = nextMealKey || 'breakfast';
    // @ts-ignore
    const displayMeal = dietPlan.meals[displayMealKey];
    const mealInfo = nextMealKey ? displayMeal.name : t.doneMeals;
    const mealCals = nextMealKey ? `${toLocalNum(displayMeal.calories, language)} ${t.calories}` : "✅";
    const achievements = [];
    if (waterIntake >= 8)
        achievements.push({ icon: '💧', text: t.achievWater, color: 'bg-blue-100 text-blue-700' });
    if (dailyProgress.completedExercises.length === workoutPlan.exercises.length)
        achievements.push({ icon: '💪', text: t.achievWorkout, color: 'bg-orange-100 text-orange-700' });
    if (!nextMealKey)
        achievements.push({ icon: '🥗', text: t.achievDiet, color: 'bg-green-100 text-green-700' });
    if (achievements.length === 3)
        achievements.push({ icon: '😴', text: t.achievSleep, color: 'bg-indigo-100 text-indigo-700' });
    return (_jsxs("div", { className: "space-y-6 pb-6", children: [_jsxs("header", { className: "bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-6 rounded-b-3xl shadow-lg relative", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center gap-4 mb-4", children: _jsxs("div", { className: "flex items-center gap-4", children: [userProfile.avatar ? (_jsx("img", { src: userProfile.avatar, alt: "Profile", className: "w-16 h-16 rounded-full border-2 border-white/50 shadow-md object-cover" })) : (_jsx("div", { className: "w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-2xl", children: "\uD83D\uDC64" })), _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold", children: [t.welcome, ", ", userProfile.name, " \uD83D\uDC4B"] }), _jsx("p", { className: "opacity-90 text-sm", children: t.todaysGoal })] })] }) }), _jsxs("div", { className: "grid grid-cols-3 gap-3 mt-4 md:max-w-lg", children: [_jsxs("div", { className: "bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center", children: [_jsx("span", { className: "block text-2xl font-bold", children: toLocalNum(userProfile.weight, language) }), _jsx("span", { className: "text-xs opacity-80", children: t.currentWeight })] }), _jsxs("div", { className: "bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center", children: [_jsx("span", { className: "block text-2xl font-bold", children: toLocalNum(waterIntake, language) }), _jsx("span", { className: "text-xs opacity-80", children: t.waterCups })] }), _jsxs("div", { className: "bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center", children: [_jsx("span", { className: "block text-2xl font-bold", children: toLocalNum(dietPlan.dailyCalories, language) }), _jsxs("span", { className: "text-xs opacity-80", children: [t.target, " (Kcal)"] })] })] })] }), _jsxs("div", { className: "px-4 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-800 mb-3", children: t.dailySummary }), _jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 overflow-x-auto no-scrollbar", children: [_jsxs("div", { className: "min-w-[140px] flex-1 bg-orange-50 p-3 rounded-xl border border-orange-100", children: [_jsxs("div", { className: "text-orange-600 font-bold mb-1", children: ["\uD83D\uDD25 ", t.workout] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: workoutPlan.type }), _jsxs("span", { className: "text-xs text-orange-400 mt-2 block", children: [toLocalNum(workoutPlan.exercises.length, language), " ", t.exercises] })] }), _jsxs("div", { className: "min-w-[140px] flex-1 bg-green-50 p-3 rounded-xl border border-green-100", children: [_jsxs("div", { className: "text-green-600 font-bold mb-1", children: ["\uD83E\uDD57 ", nextMealKey ? t[nextMealKey] || 'Meal' : t.finishedDay] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: mealInfo }), _jsx("span", { className: "text-xs text-green-400 mt-2 block", children: mealCals })] })] })] }), achievements.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-800 mb-3", children: t.achievements }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: achievements.map((a, i) => (_jsxs("div", { className: `p-3 rounded-xl flex items-center gap-2 border border-black/5 ${a.color}`, children: [_jsx("span", { className: "text-xl", children: a.icon }), _jsx("span", { className: "font-bold text-xs", children: a.text })] }, i))) })] })), _jsxs("section", { className: "bg-blue-50 p-5 rounded-2xl border border-blue-100", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h2", { className: "text-lg font-bold text-blue-900", children: [t.waterTracker, " \uD83D\uDCA7"] }), _jsxs("span", { className: "text-blue-600 font-bold", children: [toLocalNum(waterIntake, language), " / ", toLocalNum(8, language)] })] }), _jsxs("div", { className: "flex justify-between gap-2", children: [_jsx("button", { onClick: () => onUpdateWater(-1), className: "bg-white text-blue-500 w-10 h-10 rounded-full shadow flex items-center justify-center font-bold hover:bg-blue-100", children: "-" }), _jsx("div", { className: "flex-1 flex gap-1 items-center justify-center h-10", children: [...Array(8)].map((_, i) => (_jsx("div", { className: `h-8 w-2 rounded-full transition-all ${i < waterIntake ? 'bg-blue-500' : 'bg-blue-200'}` }, i))) }), _jsx("button", { onClick: () => onUpdateWater(1), className: "bg-blue-500 text-white w-10 h-10 rounded-full shadow flex items-center justify-center font-bold hover:bg-blue-600", children: "+" })] })] })] }), _jsx("div", { children: _jsxs("section", { className: "bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h2", { className: "text-lg font-bold text-gray-800 flex items-center gap-2", children: ["\u2696\uFE0F ", language === 'ar' ? 'تحليل الوزن' : 'Weight Analysis'] }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold ${statusColor}`, children: statusText })] }), _jsxs("div", { className: "flex justify-between items-end mb-2 px-2", children: [_jsxs("div", { className: "text-center", children: [_jsx("span", { className: "text-gray-400 text-xs font-bold block mb-1", children: t.currentWeight }), _jsx("span", { className: "text-xl font-black text-gray-800", children: toLocalNum(userProfile.weight, language) })] }), _jsxs("div", { className: "flex-1 px-4 pb-2 text-center", children: [_jsx("span", { className: "text-xs font-bold text-gray-400", children: bmi >= 18.5 && bmi < 25 ? "✅" : (bmi < 18.5 ? "↗️" : "↘️") }), _jsx("div", { className: "h-1 w-full bg-gray-100 rounded-full mt-1 overflow-hidden", children: _jsx("div", { className: `h-full ${progressColor} w-1/2 mx-auto rounded-full` }) })] }), _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "text-gray-400 text-xs font-bold block mb-1", children: t.idealWeight }), _jsx("span", { className: "text-xl font-black text-teal-600", children: toLocalNum(optimalWeight.toFixed(1), language) })] })] }), _jsxs("div", { className: `mt-6 p-4 rounded-xl border-l-4 ${statusColor.replace('text', 'border')} bg-gray-50 flex items-start gap-3`, children: [_jsx("span", { className: "text-2xl mt-1", children: "\uD83D\uDCA1" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-800 text-sm leading-relaxed", children: adviceMessage }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: language === 'ar' ? "هذا تقدير بناءً على الطول والوزن." : "Based on height and weight calculation." })] })] })] }) })] })] }));
};
export default Dashboard;
