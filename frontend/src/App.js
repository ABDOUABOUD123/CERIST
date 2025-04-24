import React from "react";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { BookmarkProvider } from "./BookmarkContext";
import HomePage from "./HomePage";
import SearchResults from "./SearchResults";
import AddArticle from "./AddArticle";
import EditArticle from "./EditArticle";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import Layout from "./Layout";
import Login from "./Login";
import Register from "./Register";
import ArticleDetails from "./ArticleDetails";
import LatestVolumes from "./LatestVolumes";
import Instructions from './Instructions';
import Comites from './Comites';
import SavedArticles from './SavedArticles'; // Import the SavedArticles component

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <Router>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/article/:id" element={<ArticleDetails />} />
              <Route 
                path="/add-article" 
                element={
                  <ProtectedRoute>
                    <AddArticle />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-article/:id" 
                element={
                  <ProtectedRoute>
                    <EditArticle />
                  </ProtectedRoute>
                } 
              />
              <Route path="/latest-volumes" element={<LatestVolumes />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/comites" element={<Comites />} />
              <Route 
                path="/saved-articles" 
                element={
                  <ProtectedRoute>
                    <SavedArticles />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </BookmarkProvider>
    </AuthProvider>
  );
};

export default App;