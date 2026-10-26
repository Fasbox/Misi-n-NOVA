import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './styles.css'

const PresenterView = lazy(() => import('./views/PresenterView').then((module) => ({ default: module.PresenterView })))
const ParticipantView = lazy(() => import('./views/ParticipantView').then((module) => ({ default: module.ParticipantView })))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading"><span />Conectando con la misión…</div>}>
        <Routes>
          <Route path="/presenter" element={<PresenterView />} />
          <Route path="/participar" element={<ParticipantView />} />
          <Route path="*" element={<Navigate to="/presenter" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)
