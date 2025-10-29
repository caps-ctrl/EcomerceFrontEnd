import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "@/features/Auth/authSlice";
interface User {
  id: number;
  email: string;
  name?: string;
}

const MyProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const dispath = useDispatch();
  const handleLogout = () => {
    dispath(logout());
    navigate("/login");
  };

  if (loading) return <p className="text-center mt-10">Ładowanie...</p>;
  if (!user)
    return <p className="text-center mt-10 text-red-500">Nie zalogowano!</p>;

  return (
    <div className="max-w-md dark:text-white mx-auto mt-20 p-6 border border-blue-500 shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Your profile</h1>
      <p className="mb-6">
        <span className="font-semibold">Hello</span> {user.name}
      </p>

      <div className="flex flex-col space-y-3">
        <button
          onClick={() => navigate("/my-orders")}
          className="w-full bg-blue-800 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
        >
          Your orders
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
