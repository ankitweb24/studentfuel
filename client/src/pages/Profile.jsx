import React from "react";

export default function Profile({ student }) {
  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Student data not available.</p>
      </div>
    );
  }

  const attendanceCount =
    student.attendance?.filter((a) => a.status === "Present").length || 0;
  const totalAttendance = student.attendance?.length || 0;
  const attendancePercent =
    totalAttendance > 0 ? (attendanceCount / totalAttendance) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-10">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <img
          src={student.photo || "/default-avatar.png"}
          alt="Student Avatar"
          className="w-32 h-32 rounded-full border-4 border-emerald-400 shadow-md object-cover"
        />

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800">{student.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{student.email}</p>
          <p className="text-gray-600 text-sm">{student.phone}</p>
          <p className="text-gray-500 text-sm mt-2">
            Joined on:{" "}
            {new Date(student.joinDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-center">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-2xl font-bold text-emerald-600">
            {student.projects?.length || 0}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Attendance</p>
          <p className="text-2xl font-bold text-amber-600">
            {attendancePercent.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Status</p>
          <p
            className={`text-xl font-bold ${
              attendancePercent >= 80
                ? "text-emerald-500"
                : attendancePercent < 50
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {attendancePercent >= 80
              ? "Excellent"
              : attendancePercent < 50
              ? "Needs Work"
              : "Average"}
          </p>
        </div>
      </div>

      <div className="mt-8 text-right">
        <button className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
