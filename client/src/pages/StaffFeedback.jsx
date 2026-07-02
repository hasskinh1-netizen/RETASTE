import { useEffect, useState } from "react";
import api from "../services/api.js";

function StaffFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/staff/feedback")
      .then((response) => setFeedback(response.data.data || []))
      .catch(() => setError("Không lấy được góp ý."));
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">
          Góp ý khách hàng
        </h1>
        <p className="mt-3 text-slate-600">
          Nhận phản hồi và xử lý góp ý từ khách hàng.
        </p>
      </header>
      {error ? (
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {item.from}
                </h2>
                <span className="text-sm text-slate-500">{item.status}</span>
              </div>
              <p className="mt-3 text-slate-600">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffFeedback;
