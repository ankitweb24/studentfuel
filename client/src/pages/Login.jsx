import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/auth/login", form);
    localStorage.setItem("token", res.data.token);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input name="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 w-full mb-2" />
      <input name="password" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 w-full mb-2" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}
