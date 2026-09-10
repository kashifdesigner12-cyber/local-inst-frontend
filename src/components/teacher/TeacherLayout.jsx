import React from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

function TeacherLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ======================================================
  // MAIN MENU
  // ======================================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/teacher/dashboard",
      icon: "📊",
    },
    {
      name: "Students",
      path: "/teacher/students",
      icon: "👨‍🎓",
    },
    {
      name: "Attendance",
      path: "/teacher/attendance",
      icon: "📅",
    },
    {
      name: "Performance Entry",
      path: "/teacher/performance",
      icon: "✏️",
    },
    {
      name: "Performance Graph",
      path: "/teacher/performance-graph",
      icon: "📈",
    },
    {
      name: "Create Exam",
      path: "/teacher/exams",
      icon: "📝",
    },
  ];

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("teacherUser");

    navigate("/login", {
      replace: true,
    });
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-[#e0e5ec]">

      {/* ==================================================
          FIXED SIDEBAR
      ================================================== */}

      <aside
        className="
          fixed
          left-0
          top-0
          bottom-0
          w-64
          bg-[#e0e5ec]
          border-r
          border-slate-300/50
          shadow-[6px_0_16px_rgba(163,177,198,0.35)]
          z-50
          flex
          flex-col
        "
      >

        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="px-8 pt-9 pb-7">

          <div className="flex items-center gap-4">

            {/* Logo */}

            <div
              className="
                w-11
                h-11
                bg-white
                rounded-xl
                flex
                items-center
                justify-center
                text-white
                text-xl
                shadow-md
                shrink-0
                overflow-hidden
              "
            >
              <img
                src="/logo.png"
                alt="LocalPro1 Institute Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* Brand */}

            <div className="leading-none">

              <h2
                className="
                  text-[18px]
                  font-black
                  text-slate-900
                  tracking-wide
                "
              >
                LocalPro1 Institute
              </h2>

              <p
                className="
                  text-[11px]
                  font-medium
                  text-slate-400
                  mt-1.5
                "
              >
                Teacher Portal
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            MENU
        ================================================== */}

        <nav className="px-6 space-y-2">

          {menuItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  text-[16px]
                  font-bold
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.28)]"
                      : "text-slate-600 hover:bg-[#d7dce5] hover:text-slate-900"
                  }
                `}
              >

                <span
                  className="
                    w-7
                    text-center
                    text-[23px]
                    leading-none
                    shrink-0
                  "
                >
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </Link>
            );
          })}

        </nav>

        {/* ==================================================
            FLEX SPACE
            Logout ko hamesha bottom par rakhega
        ================================================== */}

        <div className="flex-1" />

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div
          className="
            border-t
            border-slate-300/50
            px-6
            py-6
          "
        >

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-4
              px-5
              py-4
              rounded-2xl
              text-[16px]
              font-bold
              text-rose-600
              bg-[#e0e5ec]
              border
              border-slate-300/20
              shadow-[0_4px_12px_rgba(163,177,198,0.25)]
              hover:bg-rose-50
              hover:text-rose-700
              active:scale-[0.98]
              transition-all
              duration-200
            "
          >

            <span
              className="
                w-7
                text-center
                text-[23px]
                leading-none
              "
            >
              🚪
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN CONTENT
          Sidebar ki width jitna left margin
      ================================================== */}

      <main
        className="
          ml-64
          min-h-screen
          overflow-y-auto
          overflow-x-hidden
        "
      >
        <Outlet />
      </main>

    </div>
  );
}

export default TeacherLayout;