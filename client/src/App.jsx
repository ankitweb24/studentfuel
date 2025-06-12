import { BrowserRouter, Routes, Route} from "react-router-dom";
import Nav from "./components/Nav";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import StudentDetail from "./pages/StudentDetail";
import Dashboard from "./pages/Dashboard";
import StudentProfile from "./pages/StudentProfile";
import Profile from "./pages/Profile";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-16">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          404: Page Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="text-blue-600 hover:underline font-semibold">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/list" element={<StudentList />} />
          <Route path="/add-student" element={<StudentForm />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
