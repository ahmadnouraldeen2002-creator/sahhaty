import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const Settings = ({ userProfile, language, setLanguage, onReset, t }) => {
  const loggedIn = !!(window.SAHHATY_WP && window.SAHHATY_WP.loggedIn);

  const goLogin = () => {
    // يوديه لصفحة تسجيل دخول ووردبريس ثم يرجعه لنفس الصفحة
    window.location.href =
      "/wp-login.php?redirect_to=" + encodeURIComponent(window.location.href);
  };

  const doLogout = () => {
    // تسجيل خروج من ووردبريس ثم يرجعه للموقع
    window.location.href =
      "/wp-login.php?action=logout&redirect_to=" + encodeURIComponent(window.location.origin);
  };

  return (
    _jsx("div", {
      className: "pb-20 pt-6 px-4 space-y-6",
      children: _jsxs("div", {
        className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100",
        children: [
          _jsx("h2", { className: "text-xl font-bold text-gray-800 mb-6", children: t.settingsTitle }),

          // تغيير اللغة
          _jsxs("div", {
            className: "mb-8",
            children: [
              _jsx("label", { className: "block text-gray-600 font-bold mb-3", children: t.changeLang }),
              _jsxs("div", {
                className: "grid grid-cols-3 gap-2",
                children: [
                  _jsx("button", {
                    onClick: () => setLanguage('ar'),
                    className: `p-3 rounded-xl border-2 font-bold transition-all text-sm ${language === 'ar'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'bg-white border-gray-200 text-gray-600'}`,
                    children: "العربية"
                  }),
                  _jsx("button", {
                    onClick: () => setLanguage('en'),
                    className: `p-3 rounded-xl border-2 font-bold transition-all text-sm ${language === 'en'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'bg-white border-gray-200 text-gray-600'}`,
                    children: "English"
                  }),
                  _jsx("button", {
                    onClick: () => setLanguage('fr'),
                    className: `p-3 rounded-xl border-2 font-bold transition-all text-sm ${language === 'fr'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'bg-white border-gray-200 text-gray-600'}`,
                    children: "Français"
                  })
                ]
              })
            ]
          }),

          // بطاقة الحساب (Guest أو Logged in)
          _jsxs("div", {
            className: "mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200",
            children: [
              _jsx("h3", {
                className: "text-sm font-bold text-gray-400 uppercase tracking-wider mb-3",
                children: loggedIn ? (t.account || "Account") : (t.guestMode || "Guest Mode")
              }),
              loggedIn ? (
                _jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    _jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        userProfile?.avatar
                          ? _jsx("img", {
                              src: userProfile.avatar,
                              alt: "Profile",
                              className: "w-12 h-12 rounded-full border border-gray-300 object-cover"
                            })
                          : _jsx("div", {
                              className: "w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xl",
                              children: "👤"
                            }),
                        _jsxs("div", {
                          children: [
                            _jsx("p", { className: "font-bold text-gray-800", children: userProfile?.name || "User" }),
                            _jsx("p", { className: "text-xs text-gray-500 font-bold", children: t.savedInAccount || "Your data is saved in your account" })
                          ]
                        })
                      ]
                    }),
                    _jsx("button", {
                      onClick: doLogout,
                      className: "px-4 py-2 rounded-xl font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition",
                      children: t.logout || "Logout"
                    })
                  ]
                })
              ) : (
                _jsxs("div", {
                  children: [
                    _jsx("p", {
                      className: "text-sm text-gray-700 font-bold leading-relaxed mb-4",
                      children: t.guestDesc || "You are using the app as a guest. To keep your data forever, create an account."
                    }),
                    _jsx("button", {
                      onClick: goLogin,
                      className: "w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-teal-600 to-emerald-600 shadow-lg hover:shadow-xl hover:scale-[1.01] transition",
                      children: t.loginOrCreate || (language === 'ar' ? "تسجيل الدخول / إنشاء حساب" : "Login / Create Account")

                    })
                  ]
                })
              )
            ]
          }),

          // تواصل معنا
          _jsxs("div", {
            className: "mb-8 bg-indigo-50 p-5 rounded-xl border border-indigo-100",
            children: [
              _jsxs("h3", {
                className: "font-bold text-indigo-900 mb-2 flex items-center gap-2 text-lg",
                children: [_jsx("span", { children: "📬" }), " ", t.contactUs]
              }),
              _jsx("p", {
                className: "text-sm text-indigo-800 mb-4 leading-relaxed font-medium opacity-80",
                children: t.contactUsDesc
              }),
              _jsx("a", {
                href: `mailto:noraldin7.n@gmail.com?subject=${encodeURIComponent(t.emailSubject || 'App Feedback')}`,
                className: "block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm",
                children: t.sendEmail
              })
            ]
          }),

          // زر إعادة ضبط (يمسح بيانات الخطة فقط) — اختياري
          onReset && _jsxs("button", {
            onClick: onReset,
            className: "w-full py-4 bg-orange-50 text-orange-700 rounded-xl font-bold border border-orange-100 hover:bg-orange-100 transition flex items-center justify-center gap-2",
            children: [_jsx("span", { children: "🧹" }), _jsx("span", { children: t.resetData || "Reset Plan Data" })]
          })
        ]
      })
    })
  );
};

export default Settings;
