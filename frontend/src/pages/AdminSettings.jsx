import DashboardLayout from "../layouts/DashboardLayout";

export default function AdminSettings() {

  return (

    <DashboardLayout role="admin">

      <h1 className="page-title">
        ⚙️ Admin Settings
      </h1>

      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <p>
          Platform settings module
          coming soon.
        </p>

      </div>

    </DashboardLayout>
  );
}