import { useState, useRef, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, User, Wallet, Bell, Menu, X, ArrowUpRight, ArrowDownRight, MessageCircle, Send } from 'lucide-react'
import './App.css'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transações', path: '/transactions', icon: Receipt },
    { name: 'Chat AI', path: '/chat', icon: MessageCircle },
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

function ChatInterface() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Olá! Sou o Supervisor do seu Second Brain Financeiro. Como posso te ajudar hoje?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    
    // Adiciona uma mensagem de IA vazia para ser preenchida via streaming
    setMessages(prev => [...prev, { role: 'ai', content: '' }])
    setLoading(true)

    try {
      const token = "mock_token"
      const res = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      })

      if (!res.ok) throw new Error('Erro na API')
      
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        setLoading(false) // Parar de mostrar "Pensando..." assim que a stream abrir
        
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          
          const chunkString = decoder.decode(value, { stream: true })
          const lines = chunkString.split('\\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6)
              if (dataStr === '[DONE]') break
              
              try {
                const data = JSON.parse(dataStr)
                if (data.chunk) {
                  // Atualiza a última mensagem do array (a mensagem da IA)
                  setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1].content += data.chunk
                    return newMessages
                  })
                }
              } catch (e) {
                // ignorar json parse err em pedaços quebrados
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].content = 'Desculpe, ocorreu um erro de conexão.'
        return newMessages
      })
      setLoading(false)
    }
  }

  return (
    <div className="card chat-card" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? 'var(--blue-5)' : 'var(--ink-5)',
            color: msg.role === 'user' ? 'white' : 'var(--ink-1)',
            padding: '12px 16px',
            borderRadius: '12px',
            maxWidth: '80%',
            lineHeight: 1.5,
            borderBottomRightRadius: msg.role === 'user' ? 0 : '12px',
            borderBottomLeftRadius: msg.role === 'ai' ? 0 : '12px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--ink-5)', padding: '12px 16px', borderRadius: '12px', color: 'var(--ink-3)' }}>
            Pensando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area" style={{ borderTop: '1px solid var(--ink-4)', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte sobre seus gastos, orçamentos ou teses de investimento..." 
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--ink-4)', fontSize: '1rem', outline: 'none' }}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ backgroundColor: 'var(--blue-5)', color: 'white', border: 'none', borderRadius: '8px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <Send size={20} />
        </button>
      </div>
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
        Página em construção.
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
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/profile" element={<Placeholder title="Meu Perfil" />} />
      </Routes>
    </Layout>
  )
}
