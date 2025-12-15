import { HashRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Sales from './components/pages/Sales'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/points-of-sale" element={<Sales />} />
          <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
