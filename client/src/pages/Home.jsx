import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  User,
  Mail,
  ShieldCheck,
  Settings,
  Clock
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin': return '/admin/dashboard'
      case 'professor': return '/professor/dashboard'
      case 'student': return '/student/dashboard'
      case 'hod': return '/hod/dashboard'
      default: return '/'
    }
  }

  // Styles and Animations
  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    
    .welcome-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .gradient-header {
      background: linear-gradient(135deg, var(--accent-600) 0%, #4338ca 100%);
      padding: var(--space-8);
      color: white;
      text-align: center;
      position: relative;
    }
    
    .profile-pill {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 9999px;
      padding: 4px 12px;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: var(--space-4);
    }
    
    .btn-portal {
      background: linear-gradient(135deg, var(--accent-600) 0%, var(--accent-700) 100%);
      color: white;
      padding: var(--space-4) var(--space-8);
      border-radius: var(--radius-xl);
      font-weight: 600;
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: none;
      cursor: pointer;
    }
    
    .btn-portal:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    }
    
    .icon-box {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      alignItems: center;
      justifyContent: center;
      background: white;
      color: var(--accent-600);
      box-shadow: var(--shadow-sm);
    }
  `

  return (
    <Layout title="Welcome Home">
      <style>{animationStyles}</style>

      <div className="py-12 px-4">
        <div className="welcome-card animate-fade-in-up">
          {/* Header */}
          <div className="gradient-header">
            <div className="profile-pill">
              <ShieldCheck size={12} />
              <span className="capitalize">{user?.role} Portal</span>
            </div>

            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-white/20 rounded-3xl border border-white/30 backdrop-blur-md flex items-center justify-center mx-auto animate-float">
                <User size={48} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-900 border-4 border-white shadow-lg">
                <Sparkles size={20} />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2">Hello, {user?.name || user?.email?.split('@')[0]}!</h1>
            <p className="text-indigo-100/90 text-sm max-w-sm mx-auto">
              Welcome back to AssignFlow. Your streamlined academic workspace is ready for you.
            </p>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-12 text-center">
            <div className="grid md:grid-cols-2 gap-6 mb-10 text-left">
              <div className="info-item">
                <div className="icon-box">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Email</p>
                  <p className="text-sm font-semibold text-slate-700">{user?.email}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-box">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Login</p>
                  <p className="text-sm font-semibold text-slate-700">Just Now</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => navigate(getDashboardPath())}
                className="btn-portal group"
              >
                <LayoutDashboard size={20} />
                Enter {user?.role?.toUpperCase()} Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-8 border-t border-slate-100 flex items-center justify-center gap-6">
                <button onClick={() => navigate('/settings')} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <Settings size={16} />
                  Account Settings
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <p className="text-sm font-medium text-slate-400">
                  Verifying session... <span className="text-emerald-500">Secure</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home;
