import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  Building2,
  Building,
  Hash,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  PlusCircle
} from 'lucide-react'

const CreateDepartment = () => {
  const [formData, setFormData] = useState({
    departmentName: '',
    programType: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.post('/admin/departments', formData)
      setSuccess('Department registered successfully!')
      setFormData({ departmentName: '', programType: '', address: '' })
      setTimeout(() => navigate('/admin/departments'), 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Submission failed. Please check entity codes.')
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
      maxWidth: '560px',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
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
      backgroundColor: '#f3e8ff',
      borderRadius: 'var(--radius-lg)',
      color: '#7c3aed',
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
    inputCode: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      paddingLeft: 'var(--space-10)',
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      outline: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
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
    <Layout title="Hierarchy Administration">
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
          from { opacity: 0; }
          to { opacity: 1; }
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        .form-group:nth-child(1) {
          animation-delay: 0.4s;
        }
        .form-group:nth-child(2) {
          animation-delay: 0.5s;
        }
        .submit-button {
          animation: scaleIn 0.4s ease-out 0.6s forwards;
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
              onClick={() => navigate('/admin/departments')}
              style={styles.backButton}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-600)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <ArrowLeft size={14} />
              Back to Departments
            </button>

            <div style={styles.headerContent}>
              <div style={styles.headerIcon} className="header-icon">
                <Building2 size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h2 style={styles.headerTitle}>Create New Department</h2>
                <p style={styles.headerSubtitle}>Define a new organizational unit</p>
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

            <form style={styles.form} onSubmit={handleSubmit}>


              {/* Department Name Field */}
              <div style={styles.formGroup} className="form-group">
                <label style={styles.label} htmlFor="departmentName">
                  Full Department Name
                </label>
                <div style={styles.inputWrapper} className="input-wrapper">
                  <Building size={16} style={styles.inputIcon} />
                  <input
                    id="departmentName"
                    type="text"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="e.g. Computer Science & Engineering"
                    required
                  />
                </div>
                <p style={styles.helperText}>Enter the complete official name</p>
              </div>

              {/* Program Type Field */}
              <div style={styles.formGroup} className="form-group">
                <label style={styles.label} htmlFor="programType">
                  Program Type
                </label>
                <div style={styles.inputWrapper} className="input-wrapper">
                  <input
                    id="programType"
                    type="text"
                    name="programType"
                    value={formData.programType}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="e.g. Undergraduate, Postgraduate"
                    required
                  />
                </div>
                <p style={styles.helperText}>Specify the program type</p>
              </div>

              {/* Address Field */}
              <div style={styles.formGroup} className="form-group">
                <label style={styles.label} htmlFor="address">
                  Address
                </label>
                <div style={styles.inputWrapper} className="input-wrapper">
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="e.g. Block A, Main Campus"
                    required
                  />
                </div>
                <p style={styles.helperText}>Enter the department address</p>
              </div>

              {/* Submit Button */}
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
                    Creating Department...
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    Create Department
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateDepartment
