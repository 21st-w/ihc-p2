import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('App Dashboard', () => {
  it('deve renderizar o título do dashboard', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // Verifica se a barra superior e o título da sidebar renderizam
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
    
    // Verifica se os cards do MVP estão na tela
    expect(screen.getByText('Saldo Disponível')).toBeInTheDocument()
    expect(screen.getByText('Gastos Fixos')).toBeInTheDocument()
    expect(screen.getByText('Variáveis')).toBeInTheDocument()
    expect(screen.getByText('Transações Recentes')).toBeInTheDocument()
  })

  it('deve mostrar valores consistentes no dashboard', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    expect(screen.getByText('R$ 14.350,00')).toBeInTheDocument()
  })
})
