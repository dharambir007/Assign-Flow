import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  FileCheck,
  Send,
  UserCheck,
  Award,
  Sparkles
} from 'lucide-react';

// Animated component wrapper
function AnimatedSection({ children, delay = 0, style = {} }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  // Blue theme colors
  const primaryGradient = "linear-gradient(135deg, #3B82F6, #2563EB)";
  const primaryColor = "#3B82F6";
  const primaryShadow = "rgba(59, 130, 246, 0.35)";

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Instant submission and real-time approval tracking across all levels",
      gradient: "linear-gradient(135deg, #3B82F6, #2563EB)"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Enterprise-grade encryption with role-based access control",
      gradient: "linear-gradient(135deg, #06B6D4, #0891B2)"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description: "Reduce approval time by 75% with automated workflows",
      gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Seamless communication between students, professors & HODs",
      gradient: "linear-gradient(135deg, #10B981, #059669)"
    }
  ];

  const steps = [
    {
      icon: <FileCheck className="w-7 h-7" />,
      title: "Submit Assignment",
      description: "Students upload and submit assignments with just a few clicks",
      gradient: "linear-gradient(135deg, #3B82F6, #2563EB)"
    },
    {
      icon: <Send className="w-7 h-7" />,
      title: "Professor Review",
      description: "Professors receive instant notifications and review submissions",
      gradient: "linear-gradient(135deg, #06B6D4, #0891B2)"
    },
    {
      icon: <UserCheck className="w-7 h-7" />,
      title: "HOD Approval",
      description: "Final approval from HOD with complete audit trail",
      gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)"
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Done!",
      description: "Assignment approved and archived for future reference",
      gradient: "linear-gradient(135deg, #10B981, #059669)"
    }
  ];

  const stats = [
    { value: "98%", label: "Approval Rate", desc: "Satisfaction across institutions", color: "#3B82F6" },
    { value: "24h", label: "Avg Turnaround", desc: "From submission to approval", color: "#06B6D4" },
    { value: "10k+", label: "Assignments", desc: "Successfully processed", color: "#8B5CF6" }
  ];

  const cardHover = {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', overflow: 'hidden' }}>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .feature-card:hover {
          transform: translateY(-12px) !important;
          box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2) !important;
        }
        .feature-card:hover .icon-box {
          transform: scale(1.1) rotate(5deg);
        }
        .step-card:hover .step-icon {
          transform: scale(1.15) rotate(8deg);
        }
        .cta-button:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4) !important;
        }
        .gradient-text {
          background: linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: scrollY > 50 ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                animation: heroVisible ? 'slideInLeft 0.6s ease-out' : 'none'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 15px ${primaryShadow}`,
                animation: 'float 3s ease-in-out infinite'
              }}>
                <CheckCircle style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>ApprovalFlow</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Assignment Management</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSignIn}
              className="cta-button"
              style={{
                padding: '12px 28px',
                background: primaryGradient,
                color: 'white',
                fontWeight: '600',
                fontSize: '15px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 4px 15px ${primaryShadow}`,
                transition: 'all 0.3s ease',
                animation: heroVisible ? 'slideInRight 0.6s ease-out' : 'none'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '140px',
        paddingBottom: '80px',
        background: 'linear-gradient(to bottom, #EFF6FF, #ffffff)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            padding: '8px 16px',
            borderRadius: '50px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.2s'
          }}>
            <Sparkles style={{ width: '16px', height: '16px', color: '#3B82F6', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1D4ED8' }}>Trusted by 500+ institutions</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
            lineHeight: '1.2',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.3s'
          }}>
            Assignment Approval
          </h1>
          <h1
            className="gradient-text"
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: '700',
              marginBottom: '24px',
              lineHeight: '1.2',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease 0.4s'
            }}
          >
            Made Effortless
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#6b7280',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.7',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.5s'
          }}>
            Streamline your academic workflow with our intelligent approval system.
            Fast, secure, and built for modern educational institutions.
          </p>

          {/* CTA Button */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.6s'
          }}>
            <button
              onClick={handleSignIn}
              className="cta-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                background: primaryGradient,
                color: 'white',
                fontWeight: '600',
                fontSize: '17px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 8px 25px ${primaryShadow}`,
                transition: 'all 0.3s ease'
              }}
            >
              Get Started
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Everything You Need
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              A comprehensive platform designed for modern educational institutions
            </p>
          </AnimatedSection>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px'
          }}>
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div
                  className="feature-card"
                  style={{
                    padding: '32px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    textAlign: 'center',
                    height: '100%',
                    minHeight: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    ...cardHover
                  }}
                >
                  <div
                    className="icon-box"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: 'white',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      transition: 'transform 0.4s ease'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              Simple, streamlined approval process in just four steps
            </p>
          </AnimatedSection>

          {/* Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px'
          }}>
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="step-card" style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                    <div
                      className="step-icon"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: step.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                        transition: 'transform 0.4s ease'
                      }}
                    >
                      {step.icon}
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '2px solid #3B82F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#3B82F6',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      animation: 'bounceIn 0.6s ease-out'
                    }}>
                      {index + 1}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', maxWidth: '200px', margin: '0 auto' }}>
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #1E3A8A, #1E40AF)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '700', color: 'white', marginBottom: '12px' }}>
              Trusted Worldwide
            </h2>
            <p style={{ fontSize: '17px', color: '#93C5FD' }}>
              Proven results across hundreds of institutions
            </p>
          </AnimatedSection>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px'
          }}>
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 'clamp(40px, 6vw, 64px)',
                    fontWeight: '700',
                    color: stat.color,
                    marginBottom: '8px',
                    animation: 'pulse 2s infinite'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '14px', color: '#93C5FD' }}>
                    {stat.desc}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              padding: '60px 40px',
              backgroundColor: 'white',
              borderRadius: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(59, 130, 246, 0.1)',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Ready to Transform Your Workflow?
              </h2>
              <p style={{ fontSize: '17px', color: '#6b7280', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                Join hundreds of institutions that trust our platform for secure, efficient assignment approvals.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={handleSignIn}
                  className="cta-button"
                  style={{
                    padding: '14px 28px',
                    background: primaryGradient,
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: `0 8px 20px ${primaryShadow}`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E5E7EB', backgroundColor: 'white', padding: '30px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>ApprovalFlow</span>
            </div>

            {/* Copyright */}
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
              © {new Date().getFullYear()} ApprovalFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
