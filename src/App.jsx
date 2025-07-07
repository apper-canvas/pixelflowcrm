import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import ContactsPage from '@/components/pages/ContactsPage';
import PipelinePage from '@/components/pages/PipelinePage';
import ActivitiesPage from '@/components/pages/ActivitiesPage';
import TagsPage from '@/components/pages/TagsPage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<ContactsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
<Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </Router>
  );
}

export default App;