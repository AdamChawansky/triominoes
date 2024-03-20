import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TestAvailableSpaces, TestBlockPlacer, TestGenerator, TestMoveFinder } from './game/qa.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

TestGenerator();
TestAvailableSpaces();
TestBlockPlacer();
TestMoveFinder();