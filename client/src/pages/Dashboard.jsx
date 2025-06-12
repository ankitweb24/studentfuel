import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkConsecutiveAbsents = useCallback((attendance, days = 3) => {
    if (!attendance || attendance.length < days) return false;

    const sorted = [...attendance].sort((a, b) => new Date(a.date) - new Date(b.date));
    let count = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].status === "Absent") {
        count++;
        if (count >= days) return true;
      } else {
        count = 0;
      }
    }
    return false;
  }, []);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data || []);
    } catch (err) {
      const errorMessage = err.response
        ? `Server error: ${err.response.data?.error || err.response.statusText}`
        : `Network error: ${err.message}`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const tabs = [
    { id: "all", label: "All Students" },
    { id: "top", label: "Top Performers" },
    { id: "low", label: "Needs Improvement" },
    { id: "absent", label: "Consecutive Absences" },
  ];

  const calculateProgress = useCallback((student) => {
    const joinDate = student?.joinDate ? new Date(student.joinDate) : new Date();
    const totalDays = Math.max(
      Math.ceil((new Date() - joinDate) / (1000 * 60 * 60 * 24)),
      1
    );
    const presentDays = student?.attendance?.filter((a) => a.status === "Present")?.length || 0;
    const projectCount = student?.projects?.length || 0;

    const attendanceScore = (presentDays / totalDays) * 50;
    const projectScore = Math.min((projectCount / totalDays) * 50, 50);
    return Math.min(attendanceScore + projectScore, 100);
  }, []);

  const filteredStudents = useMemo(() => {
    return students
      .map((student) => ({
        ...student,
        progress: calculateProgress(student),
        hasConsecutiveAbsents: checkConsecutiveAbsents(student.attendance),
      }))
      .filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase());
        if (tab === "top") return student.progress >= 80 && matchesSearch;
        if (tab === "low") return student.progress < 50 && matchesSearch;
        if (tab === "absent") return student.hasConsecutiveAbsents && matchesSearch;
        return matchesSearch;
      });
  }, [students, tab, search, calculateProgress, checkConsecutiveAbsents]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <svg
              className="w-8 h-8 mr-2 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Student Dashboard
          </h2>
          <div className="flex gap-4">
            <Link
              to="/add-student"
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200"
              aria-label="Add new student"
            >
              Add Student
            </Link>
            <button
              onClick={fetchStudents}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              aria-label="Refresh student data"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Refresh"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-700 text-sm font-medium flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {error}
            <button
              onClick={fetchStudents}
              className="ml-2 text-red-700 underline hover:text-red-800"
              aria-label="Retry fetching students"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            aria-label="Search students"
            aria-describedby="search-description"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <span id="search-description" className="sr-only">
            Search students by name or email
          </span>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-300 pb-2" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 sm:px-6 py-3 rounded-t-lg font-semibold text-sm sm:text-base transition-colors duration-200 ${
                tab === t.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
            >
              {t.label} (
              {t.id === "absent"
                ? filteredStudents.filter((s) => s.hasConsecutiveAbsents).length
                : filteredStudents.filter(
                    (s) =>
                      t.id === "all" ||
                      (t.id === "top" && s.progress >= 80) ||
                      (t.id === "low" && s.progress < 50)
                  ).length}
              )
            </button>
          ))}
        </div>

        {filteredStudents.length === 0 && !isLoading && (
          <div className="text-center text-gray-600 p-6 bg-white rounded-xl shadow">
            No students found for the selected criteria.{" "}
            <Link
              to="/add-student"
              className="text-blue-600 hover:underline"
              aria-label="Add a new student"
            >
              Add a new student
            </Link>
            .
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative animate-fade-in"
            >
              {student.hasConsecutiveAbsents && (
                <span
                  className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center"
                  title="3 or more consecutive absences"
                  aria-label="Warning: 3 or more consecutive absences"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Absence Alert
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{student.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{student.email}</p>
              <p className="text-sm text-gray-600 mb-3">{student.phone}</p>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Progress:</span>{" "}
                <span
                  className={`font-medium ${
                    student.progress >= 80
                      ? "text-green-600"
                      : student.progress < 50
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {student.progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ease-out ${
                    student.progress >= 80
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : student.progress < 50
                      ? "bg-gradient-to-r from-red-400 to-red-600"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-600"
                  }`}
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
              <Link
                to={`/profile/${student._id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
                aria-label={`View details for ${student.name}`}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}