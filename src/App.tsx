import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { Flow } from './pages/flow'
import { Login } from './pages/login'
import 'reactflow/dist/style.css'
import { isLoginAtom } from './atoms'
import { useAtom } from 'jotai'
import { Chat } from './pages/chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    ),
  },
  {
    path: '/chat',
    element: <Chat />,
  },
])

function App() {
  const [isLogin] = useAtom(isLoginAtom)

  return isLogin ? <RouterProvider router={router} /> : <Login />
}

export default App
