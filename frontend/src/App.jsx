import React, { useState, useEffect, useMemo } from 'react';
// Importaciones de Chart.js para Reportes
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import { loginService, getCertificatesService, createCertificateService, getUsersService, deleteUserService, registerService, updateUserService } from './services/api';
import api from './services/api'; 
import { 
  User, Lock, FileText, CheckCircle, AlertCircle, Shield, 
  LayoutDashboard, Users, LogOut, Bell, Plus, MoreVertical,
  Calendar, Menu, X, Search, Trash2, Filter, Download, XCircle, Mail, Briefcase, Edit2,
  BarChart, HelpCircle // Iconos de las nuevas vistas
} from 'lucide-react';

// Configuración de Chart.js (Asegúrate de haber corrido: npm install chart.js react-chartjs-2)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- UTILIDADES ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

// --- COMPONENTES UI ---
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-2 z-50 ${
    type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
  }`}>{type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
    {message}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 p-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = 'primary', disabled, title, type="button" }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100",
    success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100",
    warning: "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const styles = {
    validated: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 border-rose-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    corredor: 'bg-blue-100 text-blue-700 border-blue-200',
    auditor: 'bg-purple-100 text-purple-700 border-purple-200',
    true: 'bg-green-100 text-green-700 border-green-200', 
    false: 'bg-slate-100 text-slate-500 border-slate-200'
  };
  
  const key = String(status); 
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles[key] || styles.pending}`}>{status === true ? 'Activo' : status === false ? 'Inactivo' : status}</span>;
};

// --- LOGIN ---
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginService(formData.email, formData.password);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Credenciales incorrectas' : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl flex overflow-hidden max-w-4xl w-full z-10">
        <div className="w-1/2 bg-indigo-600 p-12 text-white hidden md:flex flex-col justify-between relative bg-gradient-to-br from-indigo-600 to-indigo-800">
          <div>
            <div className="flex items-center gap-2 mb-8"><Shield className="w-8 h-8"/> <span className="text-2xl font-bold tracking-wider">SIGEDOT</span></div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Gestión Documental<br/>Empresarial.</h1>
            <p className="text-indigo-100 text-lg opacity-90">Plataforma segura para la administración, validación y auditoría de certificados.</p>
          </div>
          <div className="text-xs opacity-60 font-mono">v2.0 Enterprise</div>
        </div>
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Bienvenido</h2>
            <p className="text-slate-500 mt-2">Ingresa a tu cuenta para continuar.</p>
          </div>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-3 border border-red-100"><AlertCircle size={20}/> {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full pl-4 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="admin@sigedot.com" required />
            <input type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full pl-4 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" required />
            <Button type="submit" className="w-full py-3 text-base shadow-lg shadow-indigo-200" disabled={loading}>{loading ? '...' : 'Iniciar Sesión'}</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- MODAL DE CARGA DOCUMENTOS (VERSIÓN DRAG & DROP) ---
const UploadModal = ({ onClose, onUpload }) => {
  const [formData, setFormData] = useState({ filename: '', type: 'Tributario' });
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false); // Nuevo estado visual

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.filename) return; 
    setLoading(true);
    // Llama a la función del App.jsx para la simulación
    await onUpload(formData); 
    setLoading(false);
  };

  // Funciones para la estética Drag & Drop
  const handleDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = () => setIsDragActive(false);

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Carga Masiva de Certificados</h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* DRAG & DROP BOX */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`p-10 rounded-xl transition-all duration-300 cursor-pointer ${
              isDragActive ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200'
            } border-2 border-dashed flex flex-col items-center justify-center`}
          >
            <Download size={36} className={`mb-3 ${isDragActive ? 'text-indigo-600' : 'text-slate-400'}`}/>
            <p className="font-semibold text-slate-700">Arrastra tus certificados aquí</p>
            <p className="text-sm text-slate-500 mt-1">o utiliza el formulario manual</p>
          </div>

          {/* FORMULARIO MANUAL (Para completar la simulación del envío) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del Archivo</label>
              <input required type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Balance_Marzo.pdf" value={formData.filename} onChange={e=>setFormData({...formData, filename: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoría</label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
                <option>Tributario</option>
                <option>Contable</option>
                <option>Legal</option>
                <option>RRHH</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Guardando...' : 'Confirmar Carga'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- MODAL DE USUARIO (CREAR / EDITAR) ---
const UserModal = ({ onClose, onSave, initialData = null }) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'corredor', isActive: true 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        name: initialData.name, 
        email: initialData.email, 
        password: '', // Password vacío al editar
        role: initialData.role,
        isActive: initialData.isActive 
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Usuario' : 'Registrar Usuario'}</h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <div className="relative"><User className="absolute left-3 top-2.5 text-slate-400 w-4 h-4"/><input required type="text" className="w-full pl-9 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative"><Mail className="absolute left-3 top-2.5 text-slate-400 w-4 h-4"/><input required type="email" className="w-full pl-9 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
            </label>
            <div className="relative"><Lock className="absolute left-3 top-2.5 text-slate-400 w-4 h-4"/><input required={!isEditing} type="password" className="w-full pl-9 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={isEditing ? 'Dejar en blanco para mantener actual' : ''} value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-slate-400 w-4 h-4"/>
                <select className="w-full pl-9 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})}>
                  <option value="corredor">Corredor</option>
                  <option value="auditor">Auditor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={formData.isActive} onChange={e=>setFormData({...formData, isActive: e.target.value === 'true'})}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- VISTAS ---

const DashboardView = ({ user, certificates }) => {
  const stats = useMemo(() => ({
    total: certificates.length,
    pending: certificates.filter(c => c.status === 'pending').length,
    validated: certificates.filter(c => c.status === 'validated').length,
    rejected: certificates.filter(c => c.status === 'rejected').length
  }), [certificates]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-indigo-200 transition-colors"><p className="text-slate-500 text-sm font-medium">Total Documentos</p><h3 className="text-3xl font-bold text-slate-800">{stats.total}</h3></Card>
        <Card className="hover:border-emerald-200 transition-colors border-l-4 border-l-emerald-500"><p className="text-emerald-600 text-sm font-medium">Aprobados</p><h3 className="text-3xl font-bold text-slate-800">{stats.validated}</h3></Card>
        <Card className="hover:border-amber-200 transition-colors border-l-4 border-l-amber-500"><p className="text-amber-600 text-sm font-medium">Pendientes</p><h3 className="text-3xl font-bold text-slate-800">{stats.pending}</h3></Card>
        <Card className="hover:border-rose-200 transition-colors border-l-4 border-l-rose-500"><p className="text-rose-600 text-sm font-medium">Rechazados</p><h3 className="text-3xl font-bold text-slate-800">{stats.rejected}</h3></Card>
      </div>
      
      <Card>
        <h3 className="font-bold text-slate-800 mb-6 text-lg">Actividad Reciente</h3>
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 py-10 border-2 border-dashed border-slate-100 rounded-lg">
            <FileText size={40} className="mb-2 opacity-50"/>
            <p>No hay actividad registrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className={`p-2.5 rounded-lg ${c.status === 'validated' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                  <FileText size={20}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{c.filename}</p>
                  <p className="text-xs text-slate-500">{c.User ? c.User.name : 'Usuario'} • {formatDate(c.createdAt)}</p>
                </div>
                <Badge status={c.status}/>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const DocumentsView = ({ user, certificates, onUpdateStatus, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = c.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h3 className="font-bold text-xl text-slate-800">Gestor Documental</h3>
        <div className="flex gap-3">
          <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4"/><input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 border rounded-lg text-sm" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} /></div>
          <select className="border rounded-lg py-2 px-3 text-sm" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="validated">Aprobados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold tracking-wider"><tr><th className="p-4">Documento</th><th className="p-4">Propietario</th><th className="p-4">Fecha</th><th className="p-4">Estado</th><th className="p-4 text-right">Acciones</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCerts.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 flex items-center gap-3"><div className="p-2 bg-slate-100 rounded text-indigo-600"><FileText size={20}/></div><div><p className="font-medium text-slate-900">{c.filename}</p><p className="text-xs text-slate-400">{c.size} • {c.type}</p></div></td>
                <td className="p-4">{c.User?.name}</td>
                <td className="p-4 text-xs font-mono">{formatDate(c.createdAt)}</td>
                <td className="p-4"><Badge status={c.status}/></td>
                <td className="p-4 text-right"><div className="flex justify-end gap-2">
                  {['admin', 'auditor'].includes(user.role) && c.status === 'pending' && <><Button variant="success" className="p-2 h-auto" onClick={()=>onUpdateStatus(c.id, 'validated')}><CheckCircle size={16}/></Button><Button variant="danger" className="p-2 h-auto" onClick={()=>onUpdateStatus(c.id, 'rejected')}><XCircle size={16}/></Button></>}
                  {user.role === 'admin' && <Button variant="danger" className="p-2 h-auto bg-transparent text-rose-500 hover:bg-rose-50" onClick={()=>onDelete(c.id)}><Trash2 size={16}/></Button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const UsersView = ({ users, onDelete, onEdit, onCreate }) => (
  <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-xl text-slate-800">Administración de Usuarios</h3>
      <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4"/><input type="text" placeholder="Buscar usuario..." className="pl-9 pr-4 py-2 border rounded-lg text-sm" /></div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold tracking-wider">
          <tr><th className="p-4">Usuario</th><th className="p-4">Rol</th><th className="p-4">Estado</th><th className="p-4">Fecha Registro</th><th className="p-4 text-right">Acciones</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 flex items-center gap-3"><div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">{u.name.charAt(0)}</div><div><p className="font-medium text-slate-900">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div></td>
              <td className="p-4"><Badge status={u.role}/></td>
              <td className="p-4"><Badge status={u.isActive} type="bool"/></td>
              <td className="p-4 text-xs font-mono">{formatDate(u.createdAt)}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="warning" className="p-2 h-auto text-amber-600 bg-transparent hover:bg-amber-50" onClick={()=>onEdit(u)} title="Editar"><Edit2 size={16}/></Button>
                  <Button variant="danger" className="p-2 h-auto text-rose-500 bg-transparent hover:bg-rose-50" onClick={()=>onDelete(u.id)} title="Eliminar"><Trash2 size={16}/></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

// --- VISTA DE REPORTES ---
const ReportsView = ({ certificates }) => {
    // Datos de ejemplo para el gráfico
    const reportData = useMemo(() => {
        const statusCounts = certificates.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: ['Aprobados', 'Pendientes', 'Rechazados'],
            datasets: [
                {
                    label: '# de Documentos',
                    data: [statusCounts.validated || 0, statusCounts.pending || 0, statusCounts.rejected || 0],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.6)', // emerald
                        'rgba(251, 191, 36, 0.6)', // amber
                        'rgba(244, 63, 94, 0.6)', // rose
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(251, 191, 36, 1)',
                        'rgba(244, 63, 94, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [certificates]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Distribución de Certificados por Estado',
            },
        },
    };

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
            <h3 className="font-bold text-xl text-slate-800 mb-6">Reportes y Análisis</h3>
            <div className="w-full max-w-2xl mx-auto">
                <Bar data={reportData} options={options} />
            </div>
            <p className="text-sm text-slate-600 mt-6 pt-6 border-t border-slate-100">
                Esta sección utiliza Chart.js para proveer métricas visuales en tiempo real, demostrando la capacidad del sistema para el análisis de datos de auditoría.
            </p>
        </Card>
    );
};
// --- FIN VISTA DE REPORTES ---


// --- VISTA DE SOPORTE ---
const SupportView = () => (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[400px]">
        <h3 className="font-bold text-xl text-slate-800 mb-6">Soporte y Preguntas Frecuentes (FAQ)</h3>
        <div className="space-y-6">
            <p className="font-bold text-slate-800 text-lg">Preguntas Frecuentes</p>
            <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="font-medium text-slate-700 flex items-center gap-2"><HelpCircle size={18}/> ¿El sistema no me deja iniciar sesión?</p>
                    <p className="text-sm text-slate-600 mt-1.5 ml-6">Verifique sus credenciales. Si tiene MFA habilitado, revise su código de autenticación. Si el problema persiste, contacte a soporte.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="font-medium text-slate-700 flex items-center gap-2"><HelpCircle size={18}/> ¿Qué tipos de documentos puedo subir?</p>
                    <p className="text-sm text-slate-600 mt-1.5 ml-6">Actualmente, el sistema acepta archivos en formato PDF, PNG y JPG. Otros formatos serán rechazados en el backend por seguridad.</p>
                </div>
            </div>
            
            <p className="font-bold text-slate-800 text-lg pt-4 border-t border-slate-100">Contacto Directo</p>
            <p className="text-sm text-slate-600">Para requerimientos técnicos o soporte de errores, por favor contacte al equipo de desarrollo en:</p>
            <p className="text-lg font-mono text-indigo-600 flex items-center gap-2"><Mail size={20}/> soporte@sigedot.com</p>
        </div>
    </Card>
);
// --- FIN VISTA DE SOPORTE ---


// --- APP PRINCIPAL ---
const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Estados para modal de usuario
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('sigedot_user');
    const token = localStorage.getItem('sigedot_token');
    if (savedUser && token) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!user) return;
    if (view === 'dashboard' || view === 'documents' || view === 'reports') loadCertificates(); 
    if (view === 'users' && user.role === 'admin') loadUsers();
  }, [user, view]);

  const loadCertificates = async () => {
    try {
      const data = await getCertificatesService();
      setCertificates(data);
    } catch (e) { console.error(e); }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsersService();
      setUsers(data);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => { localStorage.clear(); setUser(null); };

  const handleUpload = async (data) => {
    try {
      // Nota: En una app real, data contendría el archivo subido, no solo el nombre.
      await createCertificateService(data); 
      setIsModalOpen(false);
      loadCertificates();
      showToast('Documento cargado');
    } catch (e) { showToast('Error al cargar', 'error'); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/certificates/${id}/status`, { status });
      loadCertificates();
      showToast(`Estado actualizado: ${status}`);
    } catch (e) { showToast('Error al actualizar', 'error'); }
  };

  const handleDeleteCert = async (id) => {
    if(!window.confirm('¿Borrar documento?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      loadCertificates();
      showToast('Documento eliminado');
    } catch (e) { showToast('Error al eliminar', 'error'); }
  };

  // Handlers Usuarios
  const handleSaveUser = async (data) => {
    try {
      if (editingUser) {
        await updateUserService(editingUser.id, data);
        showToast('Usuario actualizado correctamente');
      } else {
        await registerService(data);
        showToast('Usuario creado correctamente');
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (e) { showToast('Error al guardar usuario', 'error'); }
  };

  const handleEditUserClick = (userToEdit) => {
    setEditingUser(userToEdit);
    setIsUserModalOpen(true);
  };

  const handleCreateUserClick = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm('¿Eliminar usuario del sistema?')) return;
    try {
      await deleteUserService(id);
      loadUsers();
      showToast('Usuario eliminado');
    } catch (e) { showToast('Error al eliminar usuario', 'error'); }
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-600">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={()=>setSidebarOpen(false)}></div>}

      <aside className={`w-64 bg-slate-900 text-white fixed h-full flex flex-col z-30 shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl"><Shield className="text-indigo-500 fill-indigo-500"/> SIGEDOT</div>
          <button className="md:hidden" onClick={()=>setSidebarOpen(false)}><X/></button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard size={20}/> Dashboard</button>
          <button onClick={() => setView('documents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${view === 'documents' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><FileText size={20}/> Documentos</button>
          {user.role === 'admin' && <button onClick={() => setView('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${view === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Users size={20}/> Usuarios</button>}
          {/* Vistas Nuevas */}
          <button onClick={() => setView('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${view === 'reports' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><BarChart size={20}/> Reportes</button>
          <button onClick={() => setView('support')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${view === 'support' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><AlertCircle size={20}/> Soporte</button>
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">{user.name.charAt(0)}</div>
            <div className="overflow-hidden min-w-0 flex-1"><p className="text-sm font-medium truncate">{user.name}</p><p className="text-xs text-indigo-300 capitalize">{user.role}</p></div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400"><LogOut size={18}/></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all overflow-y-auto">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 py-4 md:static md:py-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600" onClick={()=>setSidebarOpen(true)}><Menu/></button>
            <h2 className="text-2xl font-bold text-slate-800 capitalize">{view === 'users' ? 'Gestión de Personal' : view}</h2>
          </div>
          {view === 'users' ? (
            <Button onClick={handleCreateUserClick} className="shadow-lg"><Plus size={18}/> Nuevo Usuario</Button>
          ) : (
            <Button onClick={() => setIsModalOpen(true)} className="shadow-lg"><Plus size={18}/> Nueva Carga</Button>
          )}
        </header>

        {view === 'dashboard' && <DashboardView user={user} certificates={certificates} />}
        {view === 'documents' && <DocumentsView user={user} certificates={certificates} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteCert} />}
        {view === 'users' && <UsersView users={users} onDelete={handleDeleteUser} onEdit={handleEditUserClick} onCreate={handleCreateUserClick} />}
        {view === 'reports' && <ReportsView certificates={certificates} />}
        {view === 'support' && <SupportView />}
      </main>

      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} onUpload={handleUpload} />}
      {isUserModalOpen && <UserModal onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} initialData={editingUser} />}
    </div>
  );
};

export default App;