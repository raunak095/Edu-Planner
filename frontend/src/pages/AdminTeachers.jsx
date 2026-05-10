import DashboardLayout from "../layouts/DashboardLayout";

export default function AdminTeachers() {

  return (

    <DashboardLayout role="admin">

      <h1 className="page-title">
        👨‍🏫 Manage Teachers
      </h1>

      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <p>
          Teacher management system
          coming soon.
        </p>

      </div>

    </DashboardLayout>
  );
}