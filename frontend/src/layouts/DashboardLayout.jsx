import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children, role }) {
  return (
    <>
      <Navbar />

      {/* ✅ PASS ROLE TO SIDEBAR */}
      <Sidebar role={role} />

      <div className="main-content">
        {children}
      </div>
    </>
  );
}