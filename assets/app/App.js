import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';

import Onboarding from './components/Onboarding.js';
import Dashboard from './components/Dashboard.js';
import Plans from './components/Plans.js';
import Chat from './components/Chat.js';
import Settings from './components/Settings.js';
import { translations } from './utils/translations.js';

/* =====================
   Constants
===================== */
const LANG_KEY = 'sahhaty_lang_v1';
const GUEST_KEY = 'sahhaty_guest_data_v1';
const MIGRATED_KEY = 'sahhaty_guest_migrated_v1';

const getTodayDate = () => new Date().toISOString().split('T')[0];
function decodeUnicodeEscapes(str) {
  if (typeof str !== 'string') return str;

  // يحول u0633u0644... إلى \u0633\u0644... ثم يفكها
  const fixed = str.replace(/u([0-9a-fA-F]{4})/g, "\\u$1");
  try {
    return JSON.parse(`"${fixed.replace(/"/g, '\\"')}"`);
  } catch {
    return str;
  }
}

function deepFix(obj) {
  if (obj == null) return obj;

  if (typeof obj === 'string') {
    // فقط إذا في uXXXX
    if (/u[0-9a-fA-F]{4}/.test(obj)) return decodeUnicodeEscapes(obj);
    return obj;
  }

  if (Array.isArray(obj)) return obj.map(deepFix);

  if (typeof obj === 'object') {
    const out = {};
    for (const k in obj) out[k] = deepFix(obj[k]);
    return out;
  }

  return obj;
}

function normalizeData(data) {
  if (!data) return null;

  // بعض الأحيان تكون data محفوظة كنص JSON
  let parsed = data;
  if (typeof data === 'string') {
    try { parsed = JSON.parse(data); } catch { parsed = data; }
  }

  // فك النصوص uXXXX
  return deepFix(parsed);
}

/* =====================
   App
===================== */
const App = ({ initialData, onSave }) => {
  const [healthData, setHealthData] = useState({
    userProfile: null,
    dietPlan: null,
    workoutPlan: null,
    weightHistory: [],
    waterIntake: 0,
    chatHistory: [],
    dailyProgress: {
      date: getTodayDate(),
      completedMeals: [],
      completedExercises: []
    }
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [loaded, setLoaded] = useState(false);
  const [language, setLanguage] = useState('ar');

  /* =====================
     Load data (WP or Guest)
  ===================== */
  useEffect(() => {
    let parsed = null;

    // logged-in user data from WP
    if (initialData) {
  parsed = normalizeData(initialData);
} else {
  const guestSaved = localStorage.getItem(GUEST_KEY);
  if (guestSaved) {
    parsed = normalizeData(guestSaved);
  }
}


    if (parsed) {
      if (!parsed.chatHistory) parsed.chatHistory = [];

      const today = getTodayDate();
      if (!parsed.dailyProgress || parsed.dailyProgress.date !== today) {
        parsed.dailyProgress = { date: today, completedMeals: [], completedExercises: [] };
        parsed.waterIntake = 0;
      }

      setHealthData(parsed);
    }

    // language
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang && ['ar', 'en', 'fr'].includes(savedLang)) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLanguage(browserLang === 'ar' ? 'ar' : 'en');
    }

    setLoaded(true);
  }, []);

  /* =====================
     Save data (Guest or WP)
  ===================== */
  useEffect(() => {
    if (!loaded) return;

    const loggedIn = !!(window.SAHHATY_WP && window.SAHHATY_WP.loggedIn);

    // logged-in → save to WP
    if (loggedIn && healthData.userProfile && onSave) {
      onSave(healthData);
      return;
    }

    // guest → save to localStorage
    localStorage.setItem(GUEST_KEY, JSON.stringify(healthData));
  }, [healthData, loaded, onSave]);

  /* =====================
     Migrate Guest → Account
  ===================== */
  useEffect(() => {
    if (!loaded) return;

    const loggedIn = !!(window.SAHHATY_WP && window.SAHHATY_WP.loggedIn);
    if (!loggedIn || !onSave) return;

    if (localStorage.getItem(MIGRATED_KEY) === 'true') return;

    const guestSaved = localStorage.getItem(GUEST_KEY);
    if (!guestSaved) {
      localStorage.setItem(MIGRATED_KEY, 'true');
      return;
    }

    try {
     const guestData = normalizeData(guestSaved);


      if (guestData && guestData.userProfile) {
        onSave(guestData);
        setHealthData(guestData);
      }

      localStorage.setItem(MIGRATED_KEY, 'true');
      // localStorage.removeItem(GUEST_KEY); // اختياري

    } catch (e) {
      localStorage.setItem(MIGRATED_KEY, 'true');
    }
  }, [loaded, onSave]);

  /* =====================
     Save language
  ===================== */
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(LANG_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, loaded]);

  /* =====================
     Handlers
  ===================== */
  const handleOnboardingComplete = (profile, diet, workout) => {
    const data = {
      userProfile: profile,
      dietPlan: diet,
      workoutPlan: workout,
      weightHistory: [
        { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), weight: profile.weight }
      ],
      waterIntake: 0,
      chatHistory: [{
        id: 'welcome',
        role: 'model',
        text: language === 'ar'
          ? `أهلاً ${profile.name}! أنا مدربك الذكي. هل لديك سؤال؟`
          : `Hello ${profile.name}! I am your smart coach. Any questions?`,
        timestamp: Date.now()
      }],
      dailyProgress: { date: getTodayDate(), completedMeals: [], completedExercises: [] }
    };

    setHealthData(data);

    const loggedIn = !!(window.SAHHATY_WP && window.SAHHATY_WP.loggedIn);
    if (loggedIn && onSave) onSave(data);
    else localStorage.setItem(GUEST_KEY, JSON.stringify(data));
  };

  const updateWater = (amount) => {
    setHealthData(prev => ({
      ...prev,
      waterIntake: Math.max(0, Math.min(15, prev.waterIntake + amount))
    }));
  };

  const updateChatHistory = (messages) => {
    setHealthData(prev => ({ ...prev, chatHistory: messages }));
  };

  const toggleMealCompletion = (mealKey) => {
    setHealthData(prev => {
      const current = prev.dailyProgress.completedMeals;
      const isCompleted = current.includes(mealKey);
      return {
        ...prev,
        dailyProgress: {
          ...prev.dailyProgress,
          completedMeals: isCompleted ? current.filter(k => k !== mealKey) : [...current, mealKey]
        }
      };
    });
  };

  const toggleExerciseCompletion = (index) => {
    setHealthData(prev => {
      const current = prev.dailyProgress.completedExercises;
      const isCompleted = current.includes(index);
      return {
        ...prev,
        dailyProgress: {
          ...prev.dailyProgress,
          completedExercises: isCompleted ? current.filter(i => i !== index) : [...current, index]
        }
      };
    });
  };

  const handleRequestAlternative = (mealName, calories) => {
    setCurrentView('chat');

    const msgText = language === 'ar'
      ? `تريد استبدال ${mealName} (${calories} سعرة)؟ 🥣\nأخبرني، ما هي المكونات المتوفرة لديك حالياً؟`
      : `Want to replace ${mealName} (${calories} cal)? 🥣\nTell me, what ingredients do you have right now?`;

    const newMessage = {
      id: Date.now().toString(),
      role: 'model',
      text: msgText,
      timestamp: Date.now()
    };

    setHealthData(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, newMessage]
    }));
  };

  const handleReset = () => {
    if (!window.confirm(translations[language].confirmLogout)) return;

    const empty = {
      userProfile: null,
      dietPlan: null,
      workoutPlan: null,
      weightHistory: [],
      waterIntake: 0,
      chatHistory: [],
      dailyProgress: { date: getTodayDate(), completedMeals: [], completedExercises: [] }
    };

    setHealthData(empty);
    setCurrentView('dashboard');

    // إذا مسجل دخول → امسح بياناته على WP
    const loggedIn = !!(window.SAHHATY_WP && window.SAHHATY_WP.loggedIn);
    if (loggedIn && onSave) onSave(empty);
    else localStorage.setItem(GUEST_KEY, JSON.stringify(empty));
  };

  /* =====================
     Render
  ===================== */
  const t = translations[language];

  if (!loaded) return null;

  if (!healthData.userProfile) {
    return _jsx(Onboarding, { onComplete: handleOnboardingComplete, language, setLanguage, t });
  }

  return (
    _jsx("div", {
      className: "min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-6 font-sans",
      children: _jsxs("main", {
        className: "w-full h-screen md:h-[92vh] md:max-w-6xl bg-white md:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col border-gray-200 md:border",
        children: [
          _jsxs("div", {
            className: "flex-1 overflow-y-auto scroll-smooth no-scrollbar relative bg-gray-50/50",
            children: [
              currentView === 'dashboard' && _jsx("div", {
                className: "h-full",
                children: _jsx(Dashboard, {
                  data: healthData,
                  onUpdateWater: updateWater,
                  onReset: handleReset,
                  language,
                  setLanguage,
                  t
                })
              }),

              currentView === 'plans' && healthData.dietPlan && healthData.workoutPlan && _jsx("div", {
                className: "h-full",
                children: _jsx(Plans, {
                  dietPlan: healthData.dietPlan,
                  workoutPlan: healthData.workoutPlan,
                  dailyProgress: healthData.dailyProgress,
                  onToggleMeal: toggleMealCompletion,
                  onToggleExercise: toggleExerciseCompletion,
                  onRequestAlternative: handleRequestAlternative,
                  t,
                  language
                })
              }),

              currentView === 'chat' && _jsx(Chat, {
                userProfile: healthData.userProfile,
                messages: healthData.chatHistory,
                onUpdateMessages: updateChatHistory,
                dietPlan: healthData.dietPlan,
                workoutPlan: healthData.workoutPlan,
                t
              }),

              currentView === 'settings' && _jsx("div", {
                className: "h-full",
                children: _jsx(Settings, {
                  userProfile: healthData.userProfile,
                  language,
                  setLanguage,
                  onReset: handleReset,
                  t
                })
              })
            ]
          }),

          _jsxs("nav", {
            className: "shrink-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-around md:justify-center md:gap-16 items-center z-50",
            children: [
              _jsx(NavButton, { active: currentView === 'dashboard', onClick: () => setCurrentView('dashboard'), icon: "🏠", label: t.navHome }),
              _jsx(NavButton, { active: currentView === 'plans', onClick: () => setCurrentView('plans'), icon: "📅", label: t.navPlan }),
              _jsx("div", {
                className: "relative -top-6",
                children: _jsx("button", {
                  onClick: () => setCurrentView('chat'),
                  className: `w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform border-4 border-gray-100 ${currentView === 'chat' ? 'bg-teal-600 text-white scale-110' : 'bg-teal-500 text-white hover:scale-105'}`,
                  children: _jsx("span", { className: "text-2xl", children: "💬" })
                })
              }),
              _jsx(NavButton, { active: currentView === 'settings', onClick: () => setCurrentView('settings'), icon: "⚙️", label: t.navSettings })
            ]
          })
        ]
      })
    })
  );
};

/* =====================
   Nav Button
===================== */
const NavButton = ({ active, onClick, icon, label }) => (
  _jsxs("button", {
    onClick,
    className: `flex flex-col items-center gap-1 transition w-16 ${active ? 'text-teal-600' : 'text-gray-400'}`,
    children: [
      _jsx("span", { className: "text-xl", children: icon }),
      _jsx("span", { className: "text-[10px] font-bold", children: label })
    ]
  })
);

export default App;
