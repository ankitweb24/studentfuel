import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AttendanceChart from "../components/AttendanceChart";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newEntry, setNewEntry] = useState({
    status: "Present",
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      setMessage("");
      try {
        const response = await axios.get(`http://localhost:5000/api/students/${id}`);
        setStudent(response.data);
        setAttendance(response.data.attendance || []);
        setProjects(response.data.projects || []);
      } catch (err) {
        setMessage(`Failed to load student data: ${err.response?.data?.error || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  const validateProject = () => {
    const newErrors = {};
    if (!newEntry.title.trim()) newErrors.title = "Title is required";
    if (!newEntry.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMarkAttendance = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      await axios.post(`http://localhost:5000/api/attendance`, {
        studentId: id,
        date: new Date().toISOString(),
        status: newEntry.status,
      });
      const response = await axios.get(`http://localhost:5000/api/students/${id}`);
      setAttendance(response.data.attendance || []);
      setMessage("Attendance marked successfully!");
    } catch (err) {
      setMessage(`Failed to mark attendance: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!validateProject()) return;
    setIsLoading(true);
    setMessage("");
    try {
      await axios.post(`http://localhost:5000/api/projects`, {
        studentId: id,
        date: new Date().toISOString(),
        title: newEntry.title,
        description: newEntry.description,
      });
      const response = await axios.get(`http://localhost:5000/api/students/${id}`);
      setProjects(response.data.projects || []);
      setNewEntry({ ...newEntry, title: "", description: "" });
      setMessage("Project added successfully!");
    } catch (err) {
      setMessage(`Failed to add project: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    setMessage("");
    try {
      const input = reportRef.current;
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${student?.name || "student"}-report.pdf`);
      setMessage("PDF exported successfully!");
    } catch (err) {
      setMessage(`Failed to export PDF: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getTileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const record = attendance.find((a) => a.date.startsWith(formattedDate));
    if (record) {
      return record.status === "Present" ? "bg-green-200" : "bg-red-200";
    }
    return null;
  };

  const getTileContent = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const record = attendance.find((a) => a.date.startsWith(formattedDate));
    return record ? <span className="text-xs font-medium">{record.status}</span> : null;
  };

  const totalDays = student?.joinDate
    ? Math.max(
        Math.ceil(
          (new Date() - new Date(student.joinDate)) / (1000 * 60 * 60 * 24)
        ),
        1
      )
    : 1;

  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const projectCount = projects.length;
  const attendanceScore = (presentDays / totalDays) * 50;
  const projectScore = Math.min((projectCount / totalDays) * 50, 50);
  const progress = Math.min(attendanceScore + projectScore, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div ref={reportRef} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : student ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                  <p className="text-gray-600 mt-1">Student ID: {student.id}</p>
                  <p className="text-gray-600">Join Date: {new Date(student.joinDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className={`mt-4 sm:mt-0 px-6 py-2 rounded-lg font-medium text-white ${
                    isExporting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors duration-200`}
                >
                  {isExporting ? "Exporting..." : "Export to PDF"}
                </button>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
                  <p className="text-2xl font-bold text-blue-600">{presentDays}/{totalDays} Days</p>
                  <p className="text-sm text-gray-600">Attendance Score: {attendanceScore.toFixed(1)}%</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                  <p className="text-2xl font-bold text-green-600">{projectCount}</p>
                  <p className="text-sm text-gray-600">Project Score: {projectScore.toFixed(1)}%</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
                  <p className="text-2xl font-bold text-purple-600">{progress.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Overall Performance</p>
                </div>
              </div>

              {/* Attendance Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Mark Attendance</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={newEntry.status}
                    onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                  <button
                    onClick={handleMarkAttendance}
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg font-medium text-white ${
                      isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    } transition-colors duration-200`}
                  >
                    {isLoading ? "Marking..." : "Mark Attendance"}
                  </button>
                </div>
                <Calendar
                  className="border rounded-lg p-4 shadow-sm"
                  tileClassName={getTileClassName}
                  tileContent={getTileContent}
                />
                <AttendanceChart attendance={attendance} />
              </div>

              {/* Projects Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          errors.title ? "border-red-500" : ""
                        }`}
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    <div>
                      <textarea
                        placeholder="Project Description"
                        value={newEntry.description}
                        onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          errors.description ? "border-red-500" : ""
                        }`}
                        rows="3"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleAddProject}
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg font-medium text-white ${
                      isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    } transition-colors duration-200`}
                  >
                    {isLoading ? "Adding..." : "Add Project"}
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-800">{project.title}</h3>
                        <p className="text-gray-600">{project.description}</p>
                        <p className="text-sm text-gray-500">
                          Added on: {new Date(project.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No projects added yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">No student data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}