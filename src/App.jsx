import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequestTour from "./components/RequestTour";
import AgentInfo from "./components/AgentInfo";
import PropertyDetails from "./tet/PropertyDetails";
import UserPage from "./pages/UserPage";
import AgentPage from "./pages/AgentPage";
import TenantPage from "./pages/TenantPage";
import LandOwnerPage from "./pages/LandOwnerPage";
import LandlordHouses from "./components/LandlordHouses";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./components/EditProfile";
import AdminOverview from "./pages/admin/AdminOverview";
import ManageAgents from "./pages/admin/ManageAgents";
import ManageLandLord from "./pages/admin/ManageLandLord";
import ManageTenants from "./pages/admin/ManageTenants";
import AddUser from "./pages/admin/AddUser";
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateLandlord from "./pages/admin/UpdateLandlord";

function App() {
  const route = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/house/:id" element={<PropertyDetails />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/landlord" element={<LandOwnerPage />} />
        <Route path="/tenant/:id" element={<TenantPage />} />
        <Route path="/houselord" element={<LandlordHouses />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />

        <Route path="/updateLandlord" element={<UpdateLandlord />} />


        import ProtectedRoute from "./components/ProtectedRoute"; // ...
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboardLayout />
            </ProtectedRoute>
          }>
          <Route index element={<AdminOverview />} />
          <Route path="agents" element={<ManageAgents />} />
          <Route path="landlords" element={<ManageLandLord />} />
          <Route path="tenants" element={<ManageTenants />} />
          <Route path="add-user" element={<AddUser />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return <RouterProvider router={route} />;
}

export default App;
