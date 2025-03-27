
// import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Button } from './components/button'
import './index.css'
import Authlayout from './components/auth/layout'
import Register from './pages/auth/register'
import Login from './pages/auth/login'

function App() {
  
  return (
    <>
      <div className='flex flex-col overflow-hidden bg-white'>
        <h1>header</h1>
        <Routes>

        <Route path="/auth" element={<Authlayout/>}>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
         
        </Route>
        </Routes>
    </div>
       
    </>
  )
}

export default App
