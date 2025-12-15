import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Sales from './components/pages/Sales'
import Products from './components/pages/Products'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Redirección por defecto a ventas */}
          <Route path="/" element={<Navigate to="/points-of-sale" replace />} />

          <Route path="/points-of-sale" element={<Sales />} />
          <Route path="/products" element={<Products />} />

          <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
