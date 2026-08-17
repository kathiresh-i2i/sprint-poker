import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import NotFoundScreen from './components/NotFoundScreen'
import CreateRoomPage from './pages/CreateRoomPage'
import RoomPage from './pages/RoomPage'

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<CreateRoomPage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
      <Route
        path="*"
        element={
          <NotFoundScreen
            icon="pi-map"
            title="Page not found"
            message="The page you're looking for doesn't exist. Head back home to create or join a room."
          />
        }
      />
    </Routes>
  )
}

export default App
