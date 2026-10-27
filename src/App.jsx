import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Animals from './pages/Animals'
import Plants from './pages/Plants'
import Environment from './pages/Environment'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/environment" element={<Environment />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App