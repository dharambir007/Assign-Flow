import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  PlusCircle
} from 'lucide-react'

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    department: ''
  })
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments')
      setDepartments(response.data.departments || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.post('/admin/users', formData)
      setSuccess('Member successfully registered!')
      setFormData({ name: '', email: '', phone: '', password: '', role: '', department: '' })
      setTimeout(() => navigate('/admin/users'), 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Submission failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-page)',
      padding: 'var(--space-6)',
    },
    formCard: {
      width: '100%',
      maxWidth: '800px',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-5)',
    },
    formGridFullWidth: {
      gridColumn: '1 / -1',
    },
    cardHeader: {
      padding: 'var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
      background: 'none',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
      marginBottom: 'var(--space-5)',
      transition: 'color var(--transition-fast)',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
    },
    headerIcon: {
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-50)',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--accent-600)',
      flexShrink: '0',
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    cardBody: {
      padding: 'var(--space-6)',
    },
    alert: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      marginBottom: 'var(--space-5)',
      backgroundColor: 'var(--color-error-light)',
      border: '1px solid rgba(220, 38, 38, 0.15)',
      borderRadius: 'var(--radius-lg)',
    },
    alertSuccess: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      marginBottom: 'var(--space-5)',
      backgroundColor: 'var(--color-success-light)',
      border: '1px solid rgba(16, 185, 129, 0.15)',
      borderRadius: 'var(--radius-lg)',
    },
    alertIcon: {
      color: 'var(--color-error)',
      flexShrink: '0',
      marginTop: '1px',
    },
    alertIconSuccess: {
      color: 'var(--color-success)',
      flexShrink: '0',
      marginTop: '1px',
    },
    alertText: {
      fontSize: '0.875rem',
      color: 'var(--color-error)',
      lineHeight: '1.5',
    },
    alertTextSuccess: {
      fontSize: '0.875rem',
      color: 'var(--color-success)',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      display: 'block',
      marginBottom: 'var(--space-2)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    inputWrapper: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: 'var(--space-4)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--gray-400)',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      paddingLeft: 'var(--space-10)',
      fontSize: '0.9375rem',
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      outline: 'none',
      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    },
    select: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      paddingLeft: 'var(--space-10)',
      fontSize: '0.9375rem',
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      outline: 'none',
      cursor: 'pointer',
      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    },
    helperText: {
      marginTop: 'var(--space-2)',
      fontSize: '0.8125rem',
      color: 'var(--text-muted)',
    },
    submitButton: {
      width: '100%',
      padding: 'var(--space-4) var(--space-6)',
      marginTop: 'var(--space-4)',
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--accent-600)',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'background-color var(--transition-fast)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
    },
    submitButtonDisabled: {
      width: '100%',
      padding: 'var(--space-4) var(--space-6)',
      marginTop: 'var(--space-4)',
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--gray-400)',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'not-allowed',
      opacity: '0.6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
    },
  }

  return (
    <Layout title="Membership Control">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .form-card {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .card-header {
          animation: fadeIn 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        .card-body {
          animation: fadeIn 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }
        .form-group {
          animation: slideInUp 0.4s ease-out forwards;
          opacity: 0;
        }
        .form-group:nth-child(1) { animation-delay: 0.4s; }
        .form-group:nth-child(2) { animation-delay: 0.5s; }
        .form-group:nth-child(3) { animation-delay: 0.6s; }
        .form-group:nth-child(4) { animation-delay: 0.7s; }
        .form-group:nth-child(5) { animation-delay: 0.8s; }
        .form-group:nth-child(6) { animation-delay: 0.9s; }
        .submit-button {
          animation: scaleIn 0.4s ease-out 1s forwards;
          opacity: 0;
        }
        .header-icon {
          transition: transform 0.3s ease;
        }
        .header-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .input-wrapper {
          transition: transform 0.2s ease;
        }
        .input-wrapper:focus-within {
          transform: translateY(-2px);
        }
      `}</style>
      <div style={styles.pageContainer}>
        <div style={styles.formCard} className="form-card">
          {/* Card Header */}
          <div style={styles.cardHeader} className="card-header">
            <button
              onClick={() => navigate('/admin/users')}
              style={styles.backButton}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-600)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <ArrowLeft size={14} />
              Back to Users
            </button>

            <div style={styles.headerContent}>
              <div style={styles.headerIcon} className="header-icon">
                <UserPlus size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h2 style={styles.headerTitle}>Create New User</h2>
                <p style={styles.headerSubtitle}>Register a new member to the system</p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div style={styles.cardBody} className="card-body">
            {/* Error Alert */}
            {error && (
              <div style={styles.alert}>
                <AlertCircle size={16} style={styles.alertIcon} />
                <p style={styles.alertText}>{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div style={styles.alertSuccess}>
                <CheckCircle size={16} style={styles.alertIconSuccess} />
                <p style={styles.alertTextSuccess}>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                {/* Full Name Field */}
                <div style={styles.formGroup} className="form-group">
                  <label style={styles.label} htmlFor="name">
                    Full Name
                  </label>
                  <div style={styles.inputWrapper} className="input-wrapper">
                    <User size={16} style={styles.inputIcon} />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="e.g. John Doe"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-500)'
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-100)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>
                  <p style={styles.helperText}>Enter the user's full name</p>
                </div>

                {/* Email Field */}
                <div style={styles.formGroup} className="form-group">
                  <label style={styles.label} htmlFor="email">
                    Email Address
                  </label>
                  <div style={styles.inputWrapper} className="input-wrapper">
                    <Mail size={16} style={styles.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="name@institution.edu"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-500)'
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-100)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>
                  <p style={styles.helperText}>Use institutional email address</p>
                </div>

                {/* Phone Field */}
                <div style={styles.formGroup} className="form-group">
                  <label style={styles.label} htmlFor="phone">
                    Phone Contact
                  </label>
                  <div style={styles.inputWrapper} className="input-wrapper">
                    <Phone size={16} style={styles.inputIcon} />
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="+1 (000) 000-0000"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-500)'
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-100)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <p style={styles.helperText}>Optional contact number</p>
                </div>

                {/* Password Field */}
                <div style={styles.formGroup} className="form-group">
                  <label style={styles.label} htmlFor="password">
                    Password
                  </label>
                  <div style={styles.inputWrapper} className="input-wrapper">
                    <Lock size={16} style={styles.inputIcon} />
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="••••••••"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-500)'
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-100)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>
                  <p style={styles.helperText}>Set a secure password</p>
                </div>

                {/* Role Field */}
                <div style={styles.formGroup} className="form-group">
                  <label style={styles.label} htmlFor="role">
                    System Role
                  </label>
                  <div style={styles.inputWrapper} className="input-wrapper">
                    <Shield size={16} style={styles.inputIcon} />
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      style={styles.select}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-500)'
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-100)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    >
                      <option value="">Choose role...</option>
                      <option value="student">Student</option>
                      <option value="professor">Professor</option>
                      <option value="hod">HOD</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>
                  <p style={styles.helperText}>Select user's access level</p>
                </div>

                {/* Department Field */}
                <div style={styles.formGroup} className="form-group">
                  <label style={styles.label} htmlFor="department">
                    Department
                  </label>
                  <div style={styles.inputWrapper} className="input-wrapper">
                    <Building2 size={16} style={styles.inputIcon} />
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      style={{
                        ...styles.select,
                        ...(formData.role === 'admin' ? { opacity: '0.5', cursor: 'not-allowed' } : {})
                      }}
                      onFocus={(e) => {
                        if (formData.role !== 'admin') {
                          e.target.style.borderColor = 'var(--accent-500)'
                          e.target.style.boxShadow = '0 0 0 3px var(--accent-100)'
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)'
                        e.target.style.boxShadow = 'none'
                      }}
                      required={formData.role !== 'admin'}
                      disabled={formData.role === 'admin'}
                    >
                      <option value="">{formData.role === 'admin' ? 'N/A (Full Access)' : 'Choose department...'}</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
                      ))}
                    </select>
                  </div>
                  <p style={styles.helperText}>
                    {formData.role === 'admin' ? 'Admins have access to all departments' : 'Select user\'s department'}
                  </p>
                </div>

                {/* Submit Button - Full Width */}
                <div style={styles.formGridFullWidth}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-button"
                    style={loading ? styles.submitButtonDisabled : styles.submitButton}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = 'var(--accent-700)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = 'var(--accent-600)'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        Creating User...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={18} />
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateUser
