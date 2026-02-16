import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  User,
  Phone,
  Building2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/auth/departments');
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        department: formData.department
      });

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Responsive styles with CSS-in-JS
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-page)',
      padding: 'var(--space-4)',
    },
    contentWrapper: {
      width: '100%',
      maxWidth: '480px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
    },
    brandHeader: {
      textAlign: 'center',
      marginBottom: 'var(--space-2)',
    },
    logoMark: {
      width: '52px',
      height: '52px',
      backgroundColor: 'var(--accent-600)',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto var(--space-4)',
      color: 'var(--text-inverse)',
    },
    brandTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
      letterSpacing: '-0.02em',
    },
    brandSubtitle: {
      fontSize: '0.9375rem',
      color: 'var(--text-tertiary)',
    },
    card: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: 'var(--space-5) var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
      textDecoration: 'none',
      marginBottom: 'var(--space-4)',
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
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: '2px',
    },
    headerSubtitle: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
    cardBody: {
      padding: 'var(--space-5) var(--space-6)',
    },
    alert: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      marginBottom: 'var(--space-5)',
      borderRadius: 'var(--radius-lg)',
    },
    alertError: {
      backgroundColor: 'var(--color-error-light)',
      border: '1px solid rgba(220, 38, 38, 0.15)',
    },
    alertSuccess: {
      backgroundColor: 'var(--color-success-light)',
      border: '1px solid rgba(5, 150, 105, 0.15)',
    },
    alertIcon: {
      flexShrink: '0',
      marginTop: '1px',
    },
    alertText: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'var(--space-4)',
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
      left: 'var(--space-3)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--gray-400)',
      pointerEvents: 'none',
      transition: 'color var(--transition-fast)',
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
    inputWithAction: {
      paddingRight: 'var(--space-10)',
    },
    passwordToggle: {
      position: 'absolute',
      right: 'var(--space-3)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--gray-400)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color var(--transition-fast)',
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
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 12px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      width: '100%',
      padding: 'var(--space-3) var(--space-5)',
      marginTop: 'var(--space-2)',
      fontSize: '0.9375rem',
      fontWeight: '500',
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--accent-600)',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'background-color var(--transition-fast)',
    },
    cardFooter: {
      padding: 'var(--space-4) var(--space-6)',
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      textAlign: 'center',
    },
    footerText: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
    },
    footerLink: {
      fontWeight: '500',
      color: 'var(--accent-600)',
      textDecoration: 'none',
    },
    securityNote: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-4)',
      fontSize: '0.75rem',
      color: 'var(--text-muted)',
    },
  };

  // CSS for responsive two-column layout on larger screens
  const responsiveStyles = `
    @media (min-width: 480px) {
      .signup-form-row {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    
    @media (max-width: 479px) {
      .signup-card-body {
        padding: var(--space-4) !important;
      }
      .signup-card-header {
        padding: var(--space-4) !important;
      }
      .signup-header-title {
        font-size: 1rem !important;
      }
      .signup-brand-title {
        font-size: 1.25rem !important;
      }
    }
  `;

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>

          {/* Brand Header */}
          <div style={styles.brandHeader}>
            <div style={styles.logoMark}>
              <ShieldCheck size={26} strokeWidth={1.5} />
            </div>
            <h1 style={styles.brandTitle} className="signup-brand-title">
              Assignment Approval System
            </h1>
            <p style={styles.brandSubtitle}>Create your student account</p>
          </div>

          {/* Registration Card */}
          <div style={styles.card}>

            {/* Card Header */}
            <div style={styles.cardHeader} className="signup-card-header">
              <Link
                to="/login"
                style={styles.backLink}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-600)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>

              <div style={styles.headerContent}>
                <div style={styles.headerIcon}>
                  <GraduationCap size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 style={styles.headerTitle} className="signup-header-title">
                    Student Registration
                  </h2>
                  <p style={styles.headerSubtitle}>Fill in your details below</p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div style={styles.cardBody} className="signup-card-body">

              {/* Error Alert */}
              {error && (
                <div style={{ ...styles.alert, ...styles.alertError }}>
                  <AlertCircle
                    size={16}
                    style={{ ...styles.alertIcon, color: 'var(--color-error)' }}
                  />
                  <p style={{ ...styles.alertText, color: 'var(--color-error)' }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div style={{ ...styles.alert, ...styles.alertSuccess }}>
                  <CheckCircle
                    size={16}
                    style={{ ...styles.alertIcon, color: 'var(--color-success)' }}
                  />
                  <p style={{ ...styles.alertText, color: 'var(--color-success)' }}>
                    {success}
                  </p>
                </div>
              )}

              <form style={styles.form} onSubmit={handleSubmit}>

                {/* Name & Email Row */}
                <div style={styles.formRow} className="signup-form-row">
                  {/* Full Name */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="name">Full Name</label>
                    <div style={styles.inputWrapper}>
                      <User size={16} style={styles.inputIcon} />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="John Doe"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent-500)';
                          e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                          e.target.previousSibling.style.color = 'var(--accent-500)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                          e.target.previousSibling.style.color = 'var(--gray-400)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="email">Email Address</label>
                    <div style={styles.inputWrapper}>
                      <Mail size={16} style={styles.inputIcon} />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="name@university.edu"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent-500)';
                          e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                          e.target.previousSibling.style.color = 'var(--accent-500)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                          e.target.previousSibling.style.color = 'var(--gray-400)';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Department Row */}
                <div style={styles.formRow} className="signup-form-row">
                  {/* Phone */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="phone">Phone Number</label>
                    <div style={styles.inputWrapper}>
                      <Phone size={16} style={styles.inputIcon} />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="+91 9876543210"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent-500)';
                          e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                          e.target.previousSibling.style.color = 'var(--accent-500)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                          e.target.previousSibling.style.color = 'var(--gray-400)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="department">Department</label>
                    <div style={styles.inputWrapper}>
                      <Building2 size={16} style={styles.inputIcon} />
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        style={styles.select}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent-500)';
                          e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                          e.target.previousSibling.style.color = 'var(--accent-500)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                          e.target.previousSibling.style.color = 'var(--gray-400)';
                        }}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password Row */}
                <div style={styles.formRow} className="signup-form-row">
                  {/* Password */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="password">Password</label>
                    <div style={styles.inputWrapper}>
                      <Lock size={16} style={styles.inputIcon} />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.inputWithAction }}
                        placeholder="Min. 6 characters"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent-500)';
                          e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        style={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-400)'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                    <div style={styles.inputWrapper}>
                      <Lock size={16} style={styles.inputIcon} />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.inputWithAction }}
                        placeholder="Re-enter password"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent-500)';
                          e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-light)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        style={styles.passwordToggle}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-400)'}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-600)';
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Security Note */}
                <div style={styles.securityNote}>
                  <Lock size={12} />
                  <span>Your information is secure and encrypted</span>
                </div>
              </form>
            </div>

            {/* Card Footer */}
            <div style={styles.cardFooter}>
              <p style={styles.footerText}>
                Already have an account?{' '}
                <Link to="/login" style={styles.footerLink}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © 2026 Assignment Approval System
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
