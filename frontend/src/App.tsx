import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateRoomPage from './pages/CreateRoomPage'
import RoomPage from './pages/RoomPage'

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<CreateRoomPage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
    </Routes>
  )
}

export default App
