import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

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
      await api.post('/api/auth/admin-signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setSuccess('Admin account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating admin account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-600)',
      borderRadius: 'var(--radius-xl)',
      marginBottom: 'var(--space-3)',
    },
    brandTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
    },
    brandSubtitle: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    formCard: {
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
      marginBottom: 'var(--space-4)',
      transition: 'color var(--transition-fast)',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    headerIcon: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-50)',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--accent-600)',
    },
    headerTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
    },
    headerSubtitle: {
      fontSize: '0.8125rem',
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
      borderRadius: 'var(--radius-lg)',
    },
    alertError: {
      backgroundColor: 'var(--color-error-light)',
      border: '1px solid rgba(220, 38, 38, 0.15)',
    },
    alertSuccess: {
      backgroundColor: 'var(--color-success-light)',
      border: '1px solid rgba(34, 197, 94, 0.15)',
    },
    alertIcon: {
      flexShrink: 0,
      marginTop: '1px',
    },
    alertText: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
    formGroup: {
      marginBottom: 'var(--space-5)',
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
    passwordToggle: {
      position: 'absolute',
      right: 'var(--space-4)',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
      color: 'var(--gray-400)',
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      width: '100%',
      padding: 'var(--space-3) var(--space-5)',
      fontSize: '0.9375rem',
      fontWeight: '500',
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--accent-600)',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'background-color var(--transition-fast)',
      marginTop: 'var(--space-2)',
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
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        {/* Brand Header */}
        <div style={styles.brandHeader}>
          <div style={styles.logoMark}>
            <ShieldCheck size={28} color="white" />
          </div>
          <h1 style={styles.brandTitle}>AssignFlow</h1>
          <p style={styles.brandSubtitle}>Create Administrator Account</p>
        </div>

        {/* Form Card */}
        <div style={styles.formCard}>
          <div style={styles.cardHeader}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button
                style={styles.backButton}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
              >
                <ArrowLeft size={14} />
                Back to login
              </button>
            </Link>
            <div style={styles.headerContent}>
              <div style={styles.headerIcon}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 style={styles.headerTitle}>Admin Registration</h2>
                <p style={styles.headerSubtitle}>Create a new administrator account</p>
              </div>
            </div>
          </div>

          <div style={styles.cardBody}>
            {/* Error Alert */}
            {error && (
              <div style={{ ...styles.alert, ...styles.alertError }}>
                <AlertCircle size={18} color="var(--color-error)" style={styles.alertIcon} />
                <span style={{ ...styles.alertText, color: 'var(--color-error)' }}>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div style={{ ...styles.alert, ...styles.alertSuccess }}>
                <CheckCircle size={18} color="var(--color-success)" style={styles.alertIcon} />
                <span style={{ ...styles.alertText, color: 'var(--color-success)' }}>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
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
                    placeholder="Enter your full name"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-500)';
                      e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Email Field */}
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
                    placeholder="admin@university.edu"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-500)';
                      e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Phone Field */}
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
                    placeholder="Enter your phone number"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-500)';
                      e.target.style.boxShadow = '0 0 0 3px var(--accent-100)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
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
                    style={styles.input}
                    placeholder="Create a password"
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
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
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
                    style={styles.input}
                    placeholder="Confirm your password"
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
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
                  'Create Admin Account'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div style={styles.cardFooter}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.footerLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
