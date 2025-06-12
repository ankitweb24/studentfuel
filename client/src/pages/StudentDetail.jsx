import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AttendanceChart from "../components/AttendanceChart"; // Assuming AttendanceChart is in the same directory

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudent = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`
      );
      console.log("Fetched student data:", response.data); // Debug log
      setStudent(response.data);
    } catch (err) {
      setError(
        `Failed to load student: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const getTileClassName = ({ date, view }) => {
    if (view !== "month" || !student?.attendance?.length) return null;

    const formattedDate = date.toISOString().split("T")[0];
    const match = student.attendance.find((a) => {
      const attendanceDate = new Date(a.date).toISOString().split("T")[0];
      console.log("Comparing dates:", formattedDate, attendanceDate); // Debug log
      return attendanceDate === formattedDate;
    });

    if (match) {
      return match.status === "Present"
        ? "bg-emerald-100 text-gray-900 font-semibold hover:bg-emerald-200"
        : "bg-red-100 text-gray-900 font-semibold hover:bg-red-200";
    }
    return null;
  };

  const getTileContent = ({ date, view }) => {
    if (view !== "month" || !student?.attendance?.length) return null;

    const formattedDate = date.toISOString().split("T")[0];
    const match = student.attendance.find((a) => {
      const attendanceDate = new Date(a.date).toISOString().split("T")[0];
      return attendanceDate === formattedDate;
    });

    if (match) {
      return (
        <span className="block text-xs" aria-hidden="true">
          {match.status === "Present" ? "✓" : "✗"}
        </span>
      );
    }
    return null;
  };

  const calculateProgress = (student) => {
    if (!student) return 0;
    const joinDate = student.joinDate ? new Date(student.joinDate) : new Date();
    const totalDays = Math.max(
      Math.ceil((new Date() - joinDate) / (1000 * 60 * 60 * 24)),
      1
    );
    const presentDays =
      student.attendance?.filter((a) => a.status === "Present")?.length || 0;
    const projectCount = student.projects?.length || 0;

    const attendanceScore = (presentDays / totalDays) * 50;
    const projectScore = Math.min((projectCount / totalDays) * 50, 50);
    return Math.min(attendanceScore + projectScore, 100);
  };

  const progress = calculateProgress(student);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {error && (
          <div
            className="p-4 mb-8 rounded-lg bg-red-100 text-red-700 text-sm font-medium flex items-center transition-all duration-300"
            role="alert"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>{error}</span>
            <button
              onClick={fetchStudent}
              className="ml-4 text-red-700 underline hover:text-red-800 font-semibold"
              aria-label="Retry fetching student data"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {student && !isLoading && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-3xl font-bold text-gray-900">
                  {student.name}'s Profile
                </h2>
                <p className="text-sm text-gray-600 mt-2">{student.email}</p>
                <p className="text-sm text-gray-600">{student.phone}</p>
                <p className="text-sm text-gray-600">
                  Joined:{" "}
                  {new Date(student.joinDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <div className="text-left sm:text-right mb-4">
                  <span className="text-sm font-semibold text-gray-700">
                    Progress:
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      progress >= 80
                        ? "text-emerald-600"
                        : progress < 50
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {" "}
                    {progress.toFixed(1)}%
                  </span>
                  <div className="w-40 h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        progress >= 80
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                          : progress < 50
                          ? "bg-gradient-to-r from-red-400 to-red-600"
                          : "bg-gradient-to-r from-amber-400 to-amber-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={fetchStudent}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold"
                  aria-label="Refresh student data"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Attendance Calendar
              </h3>
              {student.attendance?.length > 0 ? (
                <>
                  <Calendar
                    tileClassName={getTileClassName}
                    tileContent={getTileContent}
                    className="custom-calendar mx-auto"
                    navigationLabel={({ date }) =>
                      `${date.toLocaleString("default", {
                        month: "long",
                      })} ${date.getFullYear()}`
                    }
                    aria-label="Student attendance calendar"
                  />
                  <div className="flex gap-6 justify-center mt-4">
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-emerald-100 inline-block mr-2 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-700">
                        Present
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-red-100 inline-block mr-2 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-700">
                        Absent
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-600 text-lg font-medium">
                    No attendance records found
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Add attendance records for {student.name} to view the
                    calendar.
                  </p>
                </div>
              )}
            </div>

            <AttendanceChart data={student.attendance || []} />
          </div>
        )}

        {!student && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg text-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-600 text-lg font-medium">
              Student not found
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Please check the student ID and try again.
            </p>
          </div>
        )}

        <style>{`
          .custom-calendar {
            border: none;
            border-radius: 1rem;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
            padding: 1rem;
          }
          .custom-calendar .react-calendar__tile {
            padding: 1rem;
            text-align: center;
            transition: background 0.2s, transform 0.2s;
            border-radius: 0.5rem;
          }
          .custom-calendar .react-calendar__tile:hover {
            transform: scale(1.1);
          }
          .custom-calendar .react-calendar__tile--active,
          .custom-calendar .react-calendar__tile--hasActive {
            background: #10b981 !important;
            color: white !important;
            border-radius: 0.5rem;
          }
          .custom-calendar .react-calendar__navigation {
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .custom-calendar .react-calendar__navigation button {
            background: #f9fafb;
            color: #111827;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            transition: background 0.2s, color 0.2s;
            font-weight: 600;
            margin: 0 0.25rem;
          }
          .custom-calendar .react-calendar__navigation button:hover {
            background: #e5e7eb;
            color: #10b981;
          }
          .custom-calendar .react-calendar__navigation button:disabled {
            background: #f3f4f6;
            color: #d1d5db;
            cursor: not-allowed;
          }
          .custom-calendar .react-calendar__month-view__weekdays__weekday {
            font-weight: 700;
            color: #1f2937;
            text-transform: uppercase;
            font-size: 0.875rem;
            padding-bottom: 0.5rem;
          }
          .custom-calendar .react-calendar__month-view__days__day--weekend {
            color: #6b7280;
          }
          .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
            color: #d1d5db;
          }
        `}</style>
      </div>
    </div>
  );
}
