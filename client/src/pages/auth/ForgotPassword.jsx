import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccess('A verification code has been sent to your email address.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    if (otp.length !== 6) {
      setError('Verification code must be 6 digits.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/verify-otp', { email, otp });
      setSuccess('Code verified successfully.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/reset-password', { email, otp, password });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccess('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
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
    card: {
      width: '100%',
      maxWidth: '420px',
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
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
      textDecoration: 'none',
      marginBottom: 'var(--space-5)',
      transition: 'color var(--transition-fast)',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
    },
    headerIcon: {
      width: '48px',
      height: '48px',
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
      lineHeight: '1.5',
    },
    cardBody: {
      padding: 'var(--space-6)',
    },
    alertError: {
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
      border: '1px solid rgba(5, 150, 105, 0.15)',
      borderRadius: 'var(--radius-lg)',
    },
    alertIconError: {
      color: 'var(--color-error)',
      flexShrink: '0',
      marginTop: '1px',
    },
    alertIconSuccess: {
      color: 'var(--color-success)',
      flexShrink: '0',
      marginTop: '1px',
    },
    alertTextError: {
      fontSize: '0.875rem',
      color: 'var(--color-error)',
      lineHeight: '1.5',
    },
    alertTextSuccess: {
      fontSize: '0.875rem',
      color: 'var(--color-success)',
      lineHeight: '1.5',
    },
    instructionBox: {
      padding: 'var(--space-4)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 'var(--space-5)',
    },
    instructionText: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      lineHeight: '1.6',
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
    inputOtp: {
      width: '100%',
      padding: 'var(--space-4)',
      fontSize: '1.5rem',
      fontWeight: '600',
      letterSpacing: '0.5em',
      textAlign: 'center',
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
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: 'var(--space-3) var(--space-5)',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--accent-600)',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color var(--transition-fast)',
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
    stepIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      marginBottom: 'var(--space-5)',
    },
    stepDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'var(--gray-200)',
      transition: 'background-color var(--transition-fast)',
    },
    stepDotActive: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'var(--accent-600)',
    },
    emailDisplay: {
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
  };

  const getStepInfo = () => {
    switch (step) {
      case 1:
        return {
          title: 'Reset Password',
          subtitle: 'Enter your registered email address and we\'ll send you a verification code.',
        };
      case 2:
        return {
          title: 'Enter Verification Code',
          subtitle: 'We\'ve sent a 6-digit code to your email address.',
        };
      case 3:
        return {
          title: 'Create New Password',
          subtitle: 'Choose a strong password for your account.',
        };
      default:
        return { title: '', subtitle: '' };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>

        {/* Card Header */}
        <div style={styles.cardHeader}>
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
              {step === 3 ? (
                <ShieldCheck size={24} strokeWidth={1.5} />
              ) : (
                <KeyRound size={24} strokeWidth={1.5} />
              )}
            </div>
            <div>
              <h2 style={styles.headerTitle}>{stepInfo.title}</h2>
              <p style={styles.headerSubtitle}>{stepInfo.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div style={styles.cardBody}>
          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <div style={step >= 1 ? styles.stepDotActive : styles.stepDot} />
            <div style={step >= 2 ? styles.stepDotActive : styles.stepDot} />
            <div style={step >= 3 ? styles.stepDotActive : styles.stepDot} />
          </div>

          {/* Error Alert */}
          {error && (
            <div style={styles.alertError}>
              <AlertCircle size={16} style={styles.alertIconError} />
              <p style={styles.alertTextError}>{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div style={styles.alertSuccess}>
              <CheckCircle size={16} style={styles.alertIconSuccess} />
              <p style={styles.alertTextSuccess}>{success}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <div style={styles.instructionBox}>
                <p style={styles.instructionText}>
                  Enter the email address associated with your account. We'll send you a secure verification code to reset your password.
                </p>
              </div>

              <form style={styles.form} onSubmit={handleSendOTP}>
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
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
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
                </div>

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
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <>
              <div style={styles.instructionBox}>
                <p style={styles.instructionText}>
                  Enter the 6-digit verification code sent to <span style={styles.emailDisplay}>{email}</span>. The code will expire in 10 minutes.
                </p>
              </div>

              <form style={styles.form} onSubmit={handleVerifyOTP}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="otp">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                    style={styles.inputOtp}
                    placeholder="000000"
                    maxLength={6}
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
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  style={{
                    ...styles.secondaryButton,
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.color = 'var(--accent-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--accent-600)';
                  }}
                >
                  Didn't receive the code? Resend
                </button>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <div style={styles.instructionBox}>
                <p style={styles.instructionText}>
                  Create a strong password with at least 6 characters. We recommend using a mix of letters, numbers, and symbols.
                </p>
              </div>

              <form style={styles.form} onSubmit={handleResetPassword}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="password">
                    New Password
                  </label>
                  <div style={styles.inputWrapper}>
                    <Lock size={16} style={styles.inputIcon} />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      style={styles.input}
                      placeholder="Enter new password"
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
                  <p style={styles.helperText}>Minimum 6 characters</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div style={styles.inputWrapper}>
                    <Lock size={16} style={styles.inputIcon} />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      style={styles.input}
                      placeholder="Confirm new password"
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
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={styles.cardFooter}>
          <p style={styles.footerText}>
            Remember your password?{' '}
            <Link
              to="/login"
              style={styles.footerLink}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
