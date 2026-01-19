import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Company from './routes/Company'
import Qualify from './routes/Qualify'
import Modules from './routes/Modules'
import Assessment from './routes/Assessment'
import Results from './routes/Results'
import Layout from './components/Layout'
import { BenchmarkProvider } from './state/benchmarkStore'
import { AssessmentProvider } from './state/assessmentStore'
import Auth from './routes/Auth'
import Dashboard from './routes/Dashboard'
import Invite from './routes/Invite'

function App() {
  return (
    <BenchmarkProvider>
      <AssessmentProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invite/:token" element={<Invite />} />
            <Route path="/company" element={<Company />} />
            <Route path="/qualify" element={<Qualify />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/assessment/:pillarId/:metricId" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AssessmentProvider>
    </BenchmarkProvider>
  )
}

export default App
