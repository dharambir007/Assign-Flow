import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  Layers,
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  Tag,
  ArrowRight
} from 'lucide-react'

const BulkUpload = () => {
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const categories = ['Project', 'Lab Report', 'Research Paper', 'Thesis', 'Case Study', 'Other']

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf')

    if (validFiles.length !== selectedFiles.length) {
      setError('Only PDF files are allowed. Some files were filtered out.')
    } else {
      setError('')
    }

    if (validFiles.length > 10) {
      setError('Maximum 10 files allowed at once')
      setFiles(validFiles.slice(0, 10))
    } else {
      setFiles(validFiles)
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (files.length === 0) {
      setError('Please select at least one PDF file')
      return
    }

    if (!category) {
      setError('Please select a category')
      return
    }

    setLoading(true)

    const data = new FormData()
    files.forEach(file => {
      data.append('files', file)
    })
    data.append('category', category)

    try {
      await api.post('/student/bulk-upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess(`${files.length} assignments uploaded successfully!`)
      setFiles([])
      setTimeout(() => navigate('/student/assignments'), 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading assignments')
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    card: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-8)',
      boxShadow: 'var(--shadow-lg)',
      maxWidth: '640px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: 'var(--space-6)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)',
    },
    subtitle: {
      fontSize: '0.9375rem',
      color: 'var(--text-secondary)',
    },
    uploadArea: {
      border: '2px dashed var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-8)',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      backgroundColor: 'var(--bg-secondary)',
      marginBottom: 'var(--space-6)',
    },
    fileList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)',
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-3) var(--space-4)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      transition: 'all var(--transition-fast)',
    },
    fileName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
    },
    removeBtn: {
      color: 'var(--text-tertiary)',
      cursor: 'pointer',
      padding: 'var(--space-1)',
      borderRadius: 'var(--radius-md)',
      transition: 'all var(--transition-fast)',
    },
    submitBtn: {
      width: '100%',
      padding: 'var(--space-4)',
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--accent-600)',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      transition: 'all var(--transition-fast)',
      marginTop: 'var(--space-6)',
    },
    alert: {
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 'var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      fontSize: '0.9375rem',
      fontWeight: '500',
    },
  }

  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .page-bg {
      position: relative;
    }
    
    .page-bg::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.04) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }
    
    .upload-area-hover:hover {
      border-color: var(--accent-500);
      background-color: var(--accent-50);
    }
    
    .remove-btn-hover:hover {
      color: var(--color-error);
      background-color: var(--color-error-light);
    }
    
    .input-focus:focus {
      border-color: var(--accent-500) !important;
      background-color: var(--bg-primary) !important;
      box-shadow: 0 0 0 3px var(--accent-100) !important;
    }
  `

  return (
    <Layout title="Bulk Upload">
      <style>{animationStyles}</style>

      <div className="page-bg">
        <div className="content-wrapper animate-fade-in-up">
          <div style={styles.card} className="glass-card">

            <div style={styles.header}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                backgroundColor: 'var(--accent-100)',
                color: 'var(--accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)'
              }}>
                <Layers size={32} />
              </div>
              <h1 style={styles.title}>Bulk Upload</h1>
              <p style={styles.subtitle}>Upload multiple assignments at once (Max 10)</p>
            </div>

            {error && (
              <div style={{ ...styles.alert, backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {success && (
              <div style={{ ...styles.alert, backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                <CheckCircle size={20} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                }}>
                  <Tag size={16} style={{ color: 'var(--text-tertiary)' }} />
                  Category for all files
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: '0.9375rem',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                    className="input-focus"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--gray-400)' }}>
                    <ArrowRight size={14} style={{ transform: 'rotate(90deg)' }} />
                  </div>
                </div>
              </div>

              <div
                className="upload-area-hover"
                style={{
                  ...styles.uploadArea,
                  borderColor: files.length > 0 ? 'var(--accent-500)' : 'var(--border-light)',
                  backgroundColor: files.length > 0 ? 'var(--accent-50)' : 'var(--bg-secondary)',
                }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload" style={{ cursor: 'pointer', display: 'block', height: '100%' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: files.length > 0 ? 'var(--accent-200)' : 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-3)',
                    color: files.length > 0 ? 'var(--accent-700)' : 'var(--text-tertiary)',
                    transition: 'all var(--transition-fast)'
                  }}>
                    <Upload size={24} />
                  </div>
                  {files.length > 0 ? (
                    <div>
                      <p style={{ fontWeight: '600', color: 'var(--accent-700)', marginBottom: '4px' }}>
                        {files.length} Files Selected
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--accent-600)' }}>
                        Click to add more
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px' }}>Click to select PDF files</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Maximum 10 files, PDF only</p>
                    </div>
                  )}
                </label>
              </div>

              {files.length > 0 && (
                <div style={styles.fileList}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Selected Files</p>
                  {files.map((file, index) => (
                    <div key={index} style={styles.fileItem}>
                      <div style={styles.fileName}>
                        <FileText size={16} className="text-gray-400" />
                        <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {file.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: 'var(--space-2)' }}>
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={styles.removeBtn}
                        className="remove-btn-hover"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || files.length === 0}
                style={{
                  ...styles.submitBtn,
                  opacity: loading || files.length === 0 ? 0.7 : 1,
                  cursor: loading || files.length === 0 ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => !loading && files.length > 0 && (e.currentTarget.style.backgroundColor = 'var(--accent-700)')}
                onMouseLeave={(e) => !loading && files.length > 0 && (e.currentTarget.style.backgroundColor = 'var(--accent-600)')}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
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

export default BulkUpload
