import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Presentation,
  ArrowLeft,
  Mail,
  Lock,
  Loader2,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Crown
} from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      subtitle: 'Submit and track assignments',
      icon: GraduationCap,
    },
    {
      id: 'professor',
      title: 'Professor',
      subtitle: 'Review student submissions',
      icon: Presentation,
    },
    {
      id: 'hod',
      title: 'Head of Department',
      subtitle: 'Final approval authority',
      icon: Crown,
    },
    {
      id: 'admin',
      title: 'Administrator',
      subtitle: 'System and user management',
      icon: ShieldCheck,
    }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        const userRole = result.user.role;

        if (selectedRole !== userRole) {
          setError(`This account is not registered as ${selectedRole}. Please select the correct role.`);
          setLoading(false);
          return;
        }

        switch (userRole) {
          case 'admin': navigate('/admin/dashboard'); break;
          case 'professor': navigate('/professor/dashboard'); break;
          case 'student': navigate('/student/dashboard'); break;
          case 'hod': navigate('/hod/dashboard'); break;
          default: navigate('/home');
        }
      } else {
        setError(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    setPassword('');
    setSelectedRole(null);
  };

  // Styles
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-page)',
      padding: 'var(--space-6)',
    },
    roleSelectionContainer: {
      width: '100%',
      maxWidth: '960px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    brandHeader: {
      textAlign: 'center',
      marginBottom: 'var(--space-12)',
    },
    logoMark: {
      width: '56px',
      height: '56px',
      backgroundColor: 'var(--accent-600)',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto var(--space-5)',
      color: 'var(--text-inverse)',
    },
    brandTitle: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)',
      letterSpacing: '-0.02em',
    },
    brandSubtitle: {
      fontSize: '0.9375rem',
      color: 'var(--text-tertiary)',
    },
    rolesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--space-4)',
      width: '100%',
    },
    roleCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'var(--space-8) var(--space-6)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      textAlign: 'center',
    },
    roleIconContainer: {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--gray-100)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 'var(--space-4)',
      color: 'var(--gray-600)',
      transition: 'all var(--transition-fast)',
    },
    roleTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
    },
    roleSubtitle: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
      marginBottom: 'var(--space-4)',
    },
    roleAction: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--accent-600)',
      opacity: '0',
      transition: 'opacity var(--transition-fast)',
    },
    footer: {
      marginTop: 'var(--space-12)',
      textAlign: 'center',
      fontSize: '0.8125rem',
      color: 'var(--text-muted)',
    },
    loginCard: {
      width: '100%',
      maxWidth: '400px',
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
    alertIcon: {
      color: 'var(--color-error)',
      flexShrink: '0',
      marginTop: '1px',
    },
    alertText: {
      fontSize: '0.875rem',
      color: 'var(--color-error)',
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
    helperText: {
      marginTop: 'var(--space-2)',
      fontSize: '0.8125rem',
      color: 'var(--text-muted)',
    },
    formOptions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: 'var(--accent-600)',
      cursor: 'pointer',
    },
    forgotLink: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--accent-600)',
      textDecoration: 'none',
      transition: 'color var(--transition-fast)',
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

  // ROLE SELECTION SCREEN
  if (!selectedRole) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.roleSelectionContainer}>

          {/* Brand Header */}
          <div style={styles.brandHeader}>
            <div style={styles.logoMark}>
              <ShieldCheck size={28} strokeWidth={1.5} />
            </div>
            <h1 style={styles.brandTitle}>Assignment Approval System</h1>
            <p style={styles.brandSubtitle}>Select your role to continue</p>
          </div>

          {/* Role Cards Grid */}
          <div style={styles.rolesGrid}>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                style={styles.roleCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-200)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.querySelector('.role-icon').style.backgroundColor = 'var(--accent-600)';
                  e.currentTarget.querySelector('.role-icon').style.color = 'var(--text-inverse)';
                  e.currentTarget.querySelector('.role-action').style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.querySelector('.role-icon').style.backgroundColor = 'var(--gray-100)';
                  e.currentTarget.querySelector('.role-icon').style.color = 'var(--gray-600)';
                  e.currentTarget.querySelector('.role-action').style.opacity = '0';
                }}
              >
                <div className="role-icon" style={styles.roleIconContainer}>
                  <role.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 style={styles.roleTitle}>{role.title}</h3>
                <p style={styles.roleSubtitle}>{role.subtitle}</p>
                <span className="role-action" style={styles.roleAction}>
                  Continue <ChevronRight size={14} style={{ marginLeft: '2px' }} />
                </span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p>Secure access for authorized users only.</p>
            <p style={{ marginTop: 'var(--space-1)' }}>&copy; 2026 Assignment Approval System</p>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN FORM SCREEN
  const currentRole = roles.find(r => r.id === selectedRole);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard}>

        {/* Card Header */}
        <div style={styles.cardHeader}>
          <button
            onClick={handleBack}
            style={styles.backButton}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-600)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <ArrowLeft size={14} />
            Back to role selection
          </button>

          <div style={styles.headerContent}>
            <div style={styles.headerIcon}>
              <currentRole.icon size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={styles.headerTitle}>{currentRole.title} Sign In</h2>
              <p style={styles.headerSubtitle}>Enter your credentials to continue</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div style={styles.cardBody}>
          {/* Error Alert */}
          {error && (
            <div style={styles.alert}>
              <AlertCircle size={16} style={styles.alertIcon} />
              <p style={styles.alertText}>{error}</p>
            </div>
          )}

          <form style={styles.form} onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">
                Email Address
              </label>
              <div style={styles.inputWrapper}>
                <Mail size={16} style={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  style={styles.input}
                  placeholder="name@university.edu"
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
              <p style={styles.helperText}>Use your institutional email address</p>
            </div>

            {/* Password Field */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <div style={styles.inputWrapper}>
                <Lock size={16} style={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  style={styles.input}
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div style={styles.formOptions}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                style={styles.forgotLink}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Forgot password?
              </Link>
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={styles.cardFooter}>
          {selectedRole === 'student' ? (
            <p style={styles.footerText}>
              Don't have an account?{' '}
              <Link to="/signup" style={styles.footerLink}>
                Create account
              </Link>
            </p>
          ) : selectedRole === 'admin' ? (
            <p style={styles.footerText}>
              Create new admin account?{' '}
              <Link to="/admin-signup" style={styles.footerLink}>
                Sign Up
              </Link>
            </p>
          ) : (
            <p style={styles.footerText}>
              Need assistance?{' '}
              <a href="#" style={styles.footerLink}>
                Contact IT Support
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;