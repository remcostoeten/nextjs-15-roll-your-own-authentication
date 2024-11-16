'use client'

import AuthButton from '@/shared/components/action-button-wrapper'
import { useState } from 'react'

export default function ButtonShowcase() {
  const [demoStates, setDemoStates] = useState({
    loading: false,
    success: false,
    error: false
  })

  const simulateAction = async (type: 'success' | 'error') => {
    setDemoStates({ ...demoStates, loading: true })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (type === 'success') {
      setDemoStates({ loading: false, success: true, error: false })
    } else {
      setDemoStates({ loading: false, success: false, error: true })
    }
    
    // Reset after showing state
    setTimeout(() => {
      setDemoStates({ loading: false, success: false, error: false })
    }, 2000)
  }

  return (
    <div className="min-h-screen p-8 space-y-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Button States Showcase</h1>
        
        <div className="space-y-8">
          {/* Default State */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Default State</h2>
            <div className="grid gap-4">
              <AuthButton 
                text="Default Button" 
                type="login" 
              />
            </div>
          </div>

          {/* Loading State */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Loading State</h2>
            <div className="grid gap-4">
              <AuthButton 
                text="Loading Button" 
                type="login" 
                isLoading={true}
              />
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Interactive Demo</h2>
            <div className="grid gap-4">
              <AuthButton 
                text="Click for Success" 
                type="login"
                isLoading={demoStates.loading}
                className="bg-green-500 hover:bg-green-600"
                onClick={() => simulateAction('success')}
              />
              <AuthButton 
                text="Click for Error" 
                type="login"
                isLoading={demoStates.loading}
                className="bg-red-500 hover:bg-red-600"
                onClick={() => simulateAction('error')}
              />
            </div>
          </div>

          {/* Different Types */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Different Types</h2>
            <div className="grid gap-4">
              <AuthButton 
                text="Login Button" 
                type="login" 
              />
              <AuthButton 
                text="Register Button" 
                type="register" 
              />
              <AuthButton 
                text="Logout Button" 
                type="logout" 
              />
            </div>
          </div>

          {/* Custom Styling */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Custom Styling</h2>
            <div className="grid gap-4">
              <AuthButton 
                text="Custom Style" 
                type="login" 
                className="bg-purple-500 hover:bg-purple-600"
              />
              <AuthButton 
                text="Another Style" 
                type="login" 
                className="bg-blue-500 hover:bg-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <pre className="text-sm text-gray-200">
            <code>{`
// Basic Usage
<AuthButton 
  text="Click Me" 
  type="login" 
/>

// With Loading State
<AuthButton 
  text="Loading..." 
  type="login"
  isLoading={true}
/>

// With Custom Styling
<AuthButton 
  text="Custom Style" 
  type="login"
  className="bg-purple-500 hover:bg-purple-600"
/>
            `}</code>
          </pre>
        </div>
      </div>
    </div>
  )
} 
