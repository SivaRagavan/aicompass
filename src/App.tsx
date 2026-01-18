import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Questions from './routes/Questions'
import Assessment from './routes/Assessment'
import Results from './routes/Results'
import BenchmarkEditor from './routes/BenchmarkEditor'
import Layout from './components/Layout'
import { BenchmarkProvider } from './state/benchmarkStore'
import { AssessmentProvider } from './state/assessmentStore'

function App() {
  return (
    <BenchmarkProvider>
      <AssessmentProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/benchmark" element={<BenchmarkEditor />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AssessmentProvider>
    </BenchmarkProvider>
  )
}

export default App
