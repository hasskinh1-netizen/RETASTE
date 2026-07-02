import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h1 className="text-5xl font-semibold text-slate-900">404</h1>
      <p className="mt-4 text-lg text-slate-600">
        Trang bạn tìm không tồn tại.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Trở về trang chủ
      </Link>
    </div>
  );
}

export default NotFound;
