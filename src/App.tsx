import { useEffect, useState } from 'react'
import {themeChange} from 'theme-change'

function App() {
  
  useEffect(() => themeChange(false), [])
  
  return (
    <div className="hero min-h-screen bg-base-200">
      <header className="text-center hero-content ">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold ">
            Hello World
          </h1>
          <p className="mb-5">
            Welcome to AlgoBoy-Kevin's basic setup. If this page is not displaying properly, please check your settings. Happy hacking!
          </p>
          <select data-choose-theme className=' text-black'>
            <option value="">Change Theme</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="cupcake">Cupcake</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="synthwave">Synthwave</option>
          </select>
        </div>
    
      </header>
    </div>
  )
}

export default App
