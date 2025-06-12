import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data || []);
    } catch (err) {
      setError(`Failed to load students: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
      }))
      .filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
      );
  }, [students, search, calculateProgress]);

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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            FULL STACK STUDENTS
          </h2>
          <button
            onClick={fetchStudents}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            aria-label="Refresh student list"
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
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            aria-label="Search students"
          />
        </div>

        {filteredStudents.length === 0 && !isLoading && (
          <div className="text-center text-gray-600 p-6 bg-white rounded-xl shadow">
            No students found. Try adjusting your search or adding a new student.
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <li
                key={student._id}
                className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 ${
                  index === 0 ? "rounded-t-xl" : ""
                } ${index === filteredStudents.length - 1 ? "rounded-b-xl" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      to={`/student/${student._id}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      aria-label={`View profile for ${student.name}`}
                    >
                      {student.name}
                    </Link>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-600">{student.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700">Progress:</span>
                    <span
                      className={`block text-sm font-semibold ${
                        student.progress >= 80
                          ? "text-green-600"
                          : student.progress < 50
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {student.progress.toFixed(1)}%
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          student.progress >= 80
                            ? "bg-green-500"
                            : student.progress < 50
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}