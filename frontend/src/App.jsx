import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTPVerify from "./pages/OTPVerify";

import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import StudentSubjects from "./pages/StudentSubjects";
import StudentRoadmap from "./pages/StudentRoadmap";
import StudentAnnouncements from "./pages/StudentAnnouncements";
import StudentSettings from "./pages/StudentSettings";
import StudentNotes from "./pages/StudentNotes";
import StudentAssignments from "./pages/StudentAssignments";

/* ================= NEW REALTIME CHAT ================= */

import StudentMessages from "./pages/StudentMessages";
import VideoRoom from "./pages/VideoRoom";

/* ================= TEACHER PAGES ================= */

import TeacherQuizGenerator from "./pages/TeacherQuizGenerator";
import TeacherCourses from "./pages/TeacherCourses";
import TeacherUploads from "./pages/TeacherUploads";
import TeacherAnnouncements from "./pages/TeacherAnnouncements";
import TeacherAssignments from "./pages/TeacherAssignments";

/* ================= ADMIN PAGES ================= */

import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";
import AdminTeachers from "./pages/AdminTeachers";
import AdminSettings from "./pages/AdminSettings";

/* ================= PROTECTED ROUTE ================= */

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<RoleSelect />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/otp"
          element={<OTPVerify />}
        />

        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute
              allowedRole="student"
            >
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/subjects"
          element={
            <ProtectedRoute
              allowedRole="student"
            >
              <StudentSubjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/roadmap"
          element={
            <ProtectedRoute
              allowedRole="student"
            >
              <StudentRoadmap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/notes"
          element={
            <ProtectedRoute
              allowedRole="student"
            >
              <StudentNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/announcements"
          element={
            <ProtectedRoute
              allowedRole="student"
            >
              <StudentAnnouncements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/settings"
          element={
            <ProtectedRoute
              allowedRole="student"
            >
              <StudentSettings />
            </ProtectedRoute>
          }
        />

        {/* ================= NEW STUDENT CHAT ================= */}

        <Route
          path="/student/messages"
          element={
            <ProtectedRoute
              allowedRole="student"
            >
              <StudentMessages />
            </ProtectedRoute>
          }
        />
        <Route
  path="/student/video-room"
  element={
    <ProtectedRoute
      allowedRole="student"
    >
      <VideoRoom />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/assignments"
  element={
    <ProtectedRoute
      allowedRole="student"
    >
      <StudentAssignments />
    </ProtectedRoute>
  }
/>

        {/* ================= TEACHER ROUTES ================= */}

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute
              allowedRole="teacher"
            >
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/quiz-generator"
          element={
            <ProtectedRoute
              allowedRole="teacher"
            >
              <TeacherQuizGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute
              allowedRole="teacher"
            >
              <TeacherCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/uploads"
          element={
            <ProtectedRoute
              allowedRole="teacher"
            >
              <TeacherUploads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/announcements"
          element={
            <ProtectedRoute
              allowedRole="teacher"
            >
              <TeacherAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
  path="/teacher/assignments"
  element={
    <ProtectedRoute
      allowedRole="teacher"
    >
      <TeacherAssignments />
    </ProtectedRoute>
  }
/>

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRole="admin"
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute
              allowedRole="admin"
            >
              <AdminStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute
              allowedRole="admin"
            >
              <AdminCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute
              allowedRole="admin"
            >
              <AdminTeachers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute
              allowedRole="admin"
            >
              <AdminSettings />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;