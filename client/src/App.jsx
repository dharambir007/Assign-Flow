import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import UploadAssignment from './pages/student/UploadAssignment'
import BulkUpload from './pages/student/BulkUpload'
import MyAssignments from './pages/student/MyAssignments'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import CreateDepartment from './pages/admin/CreateDepartment'
import DepartmentList from './pages/admin/DepartmentList'
import EditDepartment from './pages/admin/EditDepartment'
import CreateUser from './pages/admin/CreateUser'
import ViewUsers from './pages/admin/ViewUsers'
import EditUser from './pages/admin/EditUser'

// Professor Pages
import ProfessorDashboard from './pages/professor/Dashboard'
import ProfessorAssignments from './pages/professor/Assignments'
import ReviewAssignment from './pages/professor/ReviewAssignment'
import ViewAssignment from './pages/professor/ViewAssignment'
import ProfessorStudents from './pages/professor/Students'
import StudentAssignments from './pages/professor/StudentAssignments'

// HOD Pages
import HODDashboard from './pages/hod/Dashboard'
import HODAssignments from './pages/hod/Assignments'
import HODReviewAssignment from './pages/hod/ReviewAssignment'
import HODViewAssignment from './pages/hod/ViewAssignment'

// Layout
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

          <Route path="/student/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/upload" element={<PrivateRoute role="student"><UploadAssignment /></PrivateRoute>} />
          <Route path="/student/bulk-upload" element={<PrivateRoute role="student"><BulkUpload /></PrivateRoute>} />
          <Route path="/student/assignments" element={<PrivateRoute role="student"><MyAssignments /></PrivateRoute>} />

          <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/departments/create" element={<PrivateRoute role="admin"><CreateDepartment /></PrivateRoute>} />
          <Route path="/admin/departments" element={<PrivateRoute role="admin"><DepartmentList /></PrivateRoute>} />
          <Route path="/admin/departments/edit/:id" element={<PrivateRoute role="admin"><EditDepartment /></PrivateRoute>} />
          <Route path="/admin/users/create" element={<PrivateRoute role="admin"><CreateUser /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute role="admin"><ViewUsers /></PrivateRoute>} />
          <Route path="/admin/users/edit/:id" element={<PrivateRoute role="admin"><EditUser /></PrivateRoute>} />

          <Route path="/professor/dashboard" element={<PrivateRoute role="professor"><ProfessorDashboard /></PrivateRoute>} />
          <Route path="/professor/assignments" element={<PrivateRoute role="professor"><ProfessorAssignments /></PrivateRoute>} />
          <Route path="/professor/assignments/pending" element={<PrivateRoute role="professor"><ProfessorAssignments /></PrivateRoute>} />
          <Route path="/professor/assignments/:id/review" element={<PrivateRoute role="professor"><ReviewAssignment /></PrivateRoute>} />
          <Route path="/professor/assignments/:id" element={<PrivateRoute role="professor"><ViewAssignment /></PrivateRoute>} />
          <Route path="/professor/students" element={<PrivateRoute role="professor"><ProfessorStudents /></PrivateRoute>} />
          <Route path="/professor/students/:email/assignments" element={<PrivateRoute role="professor"><StudentAssignments /></PrivateRoute>} />

          <Route path="/hod/dashboard" element={<PrivateRoute role="hod"><HODDashboard /></PrivateRoute>} />
          <Route path="/hod/assignments" element={<PrivateRoute role="hod"><HODAssignments /></PrivateRoute>} />
          <Route path="/hod/assignments/pending" element={<PrivateRoute role="hod"><HODAssignments /></PrivateRoute>} />
          <Route path="/hod/assignments/:id/review" element={<PrivateRoute role="hod"><HODReviewAssignment /></PrivateRoute>} />
          <Route path="/hod/assignments/:id" element={<PrivateRoute role="hod"><HODViewAssignment /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
