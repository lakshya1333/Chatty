
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Login } from './pages/login.tsx'
import { Join } from './pages/join.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/join' element={<Join/>}/>
    <Route path='/welcome' element={<Login/>}/>
    <Route path='/chat' element={<App />}/>
    <Route path='/chat/:roomId' element={<App />}/>
    </Routes>
    </BrowserRouter>
)
