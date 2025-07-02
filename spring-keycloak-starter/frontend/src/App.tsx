import { Routes, Route } from "react-router-dom"
import { AppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Header } from "./components/Header"
import { Navbar } from "./components/Navbar"
import { HomePage } from "./pages/HomePage"
import { DashboardPage } from "./pages/DashboardPage"
import { ProfilePage } from "./pages/ProfilePage"
import { AuthDebugPage } from "./pages/AuthDebugPage"
import { UsersByRolePage } from "./pages/UsersByRolePage"
import { AuthProvider } from "./contexts/AuthContext"
import { TutorialsPage } from "./pages/TutoralPage"
import { ClassroomsPage} from "./pages/ClassroomsPage"

function App() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AuthProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
                <Route path="/classrooms" element={<ClassroomsPage/>} />
            <Route path="/users-by-role" element={<UsersByRolePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/debug" element={<AuthDebugPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </AuthProvider>
  )
}

export default App
