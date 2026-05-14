import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, User, Wallet, Bell, Menu, X, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import './App.css'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transações', path: '/transactions', icon: Receipt },
    { name: 'Perfil', path: '/profile', icon: User },
  ]

  return (
    <div className="app-container">
      {/* Sidebar - Desktop & Tablet */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <Wallet className="brand-icon" />
            <span className="serif">Tio Patinhas</span>
          </div>
          <button className="close-btn mobile-only" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${active ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <button className="menu-btn mobile-only" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
          <div className="header-title">
            <h1 className="serif">{navItems.find(i => i.path === location.pathname)?.name || 'Bem-vindo'}</h1>
          </div>
          <button className="action-btn">
            <Bell size={20} />
          </button>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="bottom-nav mobile-only">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} className={`bottom-nav-item ${active ? 'active' : ''}`}>
              <Icon size={24} />
              <span className="bottom-nav-label">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* Overlay for mobile sidebar */}
      {menuOpen && <div className="sidebar-overlay mobile-only" onClick={() => setMenuOpen(false)}></div>}
    </div>
  )
}

function Dashboard() {
  return (
    <div className="dashboard-grid">
      <div className="card balance-card">
        <h3 className="card-title">Saldo Disponível</h3>
        <p className="balance-value num">R$ 14.350,00</p>
        <div className="balance-trend positive">
          <ArrowUpRight size={16} />
          <span>+2.4% este mês</span>
        </div>
      </div>
      
      <div className="card stat-card">
        <h3 className="card-title">Gastos Fixos</h3>
        <p className="stat-value num">R$ 2.100,00</p>
        <div className="stat-trend negative">
          <ArrowDownRight size={16} />
          <span>R$ 150 em assinaturas</span>
        </div>
      </div>

      <div className="card stat-card">
        <h3 className="card-title">Variáveis</h3>
        <p className="stat-value num">R$ 850,00</p>
      </div>

      <div className="card recent-tx">
        <h3 className="card-title">Transações Recentes</h3>
        <ul className="tx-list">
          <li className="tx-item">
            <div className="tx-info">
              <span className="tx-name">Supermercado</span>
              <span className="tx-date">Hoje, 14:30</span>
            </div>
            <span className="tx-amount negative num">- R$ 120,50</span>
          </li>
          <li className="tx-item">
            <div className="tx-info">
              <span className="tx-name">Netflix</span>
              <span className="tx-date">Ontem</span>
            </div>
            <span className="tx-amount negative num">- R$ 55,90</span>
          </li>
          <li className="tx-item">
            <div className="tx-info">
              <span className="tx-name">Salário</span>
              <span className="tx-date">05/Maio</span>
            </div>
            <span className="tx-amount positive num">+ R$ 8.500,00</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="card placeholder-card">
      <h2>{title}</h2>
      <p style={{ marginTop: '12px', color: 'var(--ink-1)' }}>
        Página em construção com práticas de IHC aplicadas. Interface adaptável para celulares e computadores.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Placeholder title="Transações" />} />
        <Route path="/profile" element={<Placeholder title="Meu Perfil" />} />
      </Routes>
    </Layout>
  )
}
