import DashboardLayout from "../layouts/DashboardLayout";

const UserPage = () => {
  return (
    <DashboardLayout role="user">
      <h1 className="text-2xl font-bold mb-4">Welcome, User</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Saved Properties</h2>
          <p className="text-gray-500 text-sm">You haven't saved any properties yet.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Recent Activity</h2>
          <p className="text-gray-500 text-sm">No recent activity to display.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserPage;
