import React from "react";

const agents = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

const ManageAgents = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Agents</h1>
      <table className="w-full bg-white shadow-md rounded overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id} className="border-t">
              <td className="px-4 py-2">{agent.name}</td>
              <td className="px-4 py-2">{agent.email}</td>
              <td className="px-4 py-2">
                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAgents;