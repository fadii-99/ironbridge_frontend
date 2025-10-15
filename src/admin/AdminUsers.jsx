import React from "react";
import GradientButton from "./../components/GradientButton";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

const AdminUsers = () => {
  const users = [
    { id: 1, name: "Usama Kamran", email: "usama@example.com", role: "Electrician" },
    { id: 2, name: "Ali Raza", email: "ali@example.com", role: "Mechanic" },
    { id: 3, name: "Bilal Khan", email: "bilal@example.com", role: "Engineer" },
    { id: 4, name: "Hamza Ahmed", email: "hamza@example.com", role: "Technician" },
    { id: 5, name: "Zain Malik", email: "zain@example.com", role: "Supervisor" },
    { id: 6, name: "Ahsan Iqbal", email: "ahsan@example.com", role: "Manager" },
    { id: 7, name: "Sara Khan", email: "sara@example.com", role: "Operator" },
  ];

  return (
    <div className="md:mt-0 mt-16">
      {/* Header row (not scrollable) */}
      <div className="flex items-center justify-between mb-12 md:px-0 px-3">
        <h1 className="text-2xl font-bold">Users</h1>
        <GradientButton label="+ Add User" />
      </div>

      {/* Table wrapper (only this scrolls) */}
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] border-collapse text-sm w-full">
            <thead>
              <tr className="bg-black/50 border-b border-white/20 text-yellow-300">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 flex gap-4">
                    <button className="text-blue-400 hover:text-blue-300 transition">
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition">
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
