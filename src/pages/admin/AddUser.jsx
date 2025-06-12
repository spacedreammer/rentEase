import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify"; // ← Add this

const AddUser = () => {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    role: "agent", // agent or landlord
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.1:8000/api/auth/register", form);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Show toast on success
      toast.success("User added successfully!", {
        toastId: "add-user-success"
      });

      // ✅ Reset form after success
      setForm({
        fname: "",
        lname: "",
        email: "",
        role: "agent",
        phone: "",
        password: "",
      });
    } catch (err) {
      console.error("Registration failed", err.response?.data || err.message);
      toast.error("Failed to add user. " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Agent or Landlord</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fname"
          placeholder="First Name"
          className="w-full border px-3 py-2 rounded"
          value={form.fname}
          onChange={handleChange}
        />

        <input
          name="lname"
          placeholder="Last Name"
          className="w-full border px-3 py-2 rounded"
          value={form.lname}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone number"
          className="w-full border px-3 py-2 rounded"
          value={form.phone}
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full border px-3 py-2 rounded"
          value={form.role}
          onChange={handleChange}>
          <option value="agent">Agent</option>
          <option value="landlord">Landlord</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddUser;
