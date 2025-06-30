import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PropertyDetails from "./tet/PropertyDetails";
import UserPage from "./pages/UserPage";
import AgentPage from "./pages/AgentPage";
import TenantPage from "./pages/TenantPage";
import LandOwnerPage from "./pages/landlord/LandOwnerPage";
import LandlordHouses from "./components/AddPropertyForm";
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
import AppProviders from "./components/AppProvider";
import AddPropertyForm from "./components/AddPropertyForm";
import MyPropertiesPage from "./pages/landlord/MyPropertiesPage";
import DashboardLayout from "./layouts/DashboardLayout";
import EditPropertyPage from "./pages/landlord/EditProppertyPage";
import LandlordOverview from "./components/LandlordOverview";
import LandlordProfile from "./pages/landlord/LandlordProfile";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantProfile from "./pages/tenant/TenantProfile";
import LandlordTourRequests from "./pages/landlord/LandlordTourRequests";
import MessagesPage from "./pages/MessagesPage";

function App() {
  const route = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <AppProviders>
            <MainLayout />
          </AppProviders>
        }>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/house/:id" element={<PropertyDetails />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/landlord" element={<LandOwnerPage />} />
        <Route path="/tenant/:id" element={<TenantPage />} />

        {/* LANDLORD Dashboard Routes - Protected */}
        <Route
          path="/landlord" // Base path for landlord dashboard
          element={
            <ProtectedRoute allowedRole="landlord">
              <DashboardLayout role="landlord">
                <Outlet />
              </DashboardLayout>
            </ProtectedRoute>
          }>
          {/* Landlord specific children routes */}
          <Route index element={<LandlordOverview />} />
          <Route path="add-property" element={<AddPropertyForm />} />
          <Route path="my-properties" element={<MyPropertiesPage />} />
          <Route path="profile" element={<LandlordProfile />} />
          <Route path="edit-property/:id" element={<EditPropertyPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="tour-requests" element={<LandlordTourRequests />} />
          {/* <--- NEW EDIT ROUTE */}
        </Route>

        {/* <Route path="/add-property" element={<AddPropertyForm />} /> */}
        {/* <Route path="my-properties" element={<MyPropertiesPage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />

        <Route path="/updateLandlord" element={<UpdateLandlord />} />

        {/* TENANT Dashboard Routes - Protected */}
        <Route
          path="/tenant" // Base path for tenant dashboard
          element={
            <ProtectedRoute allowedRole="tenant">
              <DashboardLayout role="tenant">
                <Outlet />{" "}
              </DashboardLayout>
            </ProtectedRoute>
          }>
          {/* This is the default route rendered when navigating to /tenant */}
          <Route index element={<TenantDashboard />} />
          <Route path="profile" element={<TenantProfile />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

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
