import { HashRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './components/pages/Dashboard'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* Aquí añadirás más rutas:
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/users" element={<UsersPage />} />
          */}
          <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
