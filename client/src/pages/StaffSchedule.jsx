import { useEffect, useState } from "react";
import api from "../services/api.js";

function StaffSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/staff/schedule")
      .then((response) => setSchedule(response.data.data || []))
      .catch(() => setError("Không tải được lịch làm việc."));
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">
          Lịch làm việc cá nhân
        </h1>
        <p className="mt-3 text-slate-600">
          Xem ca trực và vị trí công việc tiếp theo của bạn.
        </p>
      </header>
      {error ? (
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {item.date}
                </h2>
                <span className="text-sm text-slate-500">{item.shift}</span>
              </div>
              <p className="mt-3 text-slate-600">Vai trò: {item.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffSchedule;
