import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Auth
import { LoginPage } from '../features/auth/Login.page';

// Features
import { ExploreTherapistsPage } from '../features/exploreTherapists/ExploreTherapists.page';
import { TherapistProfilePage } from '../features/therapistProfile/TherapistProfile.page';
import { BookingPaymentPage } from '../features/bookingPayment/BookingPayment.page';
import { MyAppointments } from '../features/myAppointments/MyAppointments.page';
import { Chat } from '../features/chat/Chat.page';
import { Favorites } from '../features/favorites/Favorites.page';
import JournalDocuments from '../features/journalDocuments/JournalDocuments.page';
import { ReviewsPage } from '../features/reviews/Reviews.page';
import { PaymentHistoryPage } from '../features/paymentHistory/PaymentHistory.page';
import NotificationsPage from '../features/notifications/Notifications.page';
import { PersonalProfilePage } from '../features/personalProfile/PersonalProfile.page';
import { AccountSettingsPage } from '../features/accountSettings/AccountSettings.page';
import { HelpCenterPage } from '../features/helpCenter/HelpCenter.page';
import { PrivacyCommitmentPage } from '../features/privacyCommitment/PrivacyCommitment.page';
import { TherapyDictionaryPage } from '../features/diccionario de terapias y dolencias/TherapyDictionary.page';

const PrivateRoute = ({ children }) => {
  // Temporarily bypass authentication completely
  return children;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <PrivateRoute>
          <DashboardLayout>
            <Navigate to="/explore-therapists" replace />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/explore-therapists" element={
        <PrivateRoute>
          <DashboardLayout>
            <ExploreTherapistsPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/therapist/:id" element={
        <PrivateRoute>
          <DashboardLayout>
            <TherapistProfilePage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/booking-payment" element={
        <PrivateRoute>
          <DashboardLayout>
            <BookingPaymentPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/my-appointments" element={
        <PrivateRoute>
          <DashboardLayout>
            <MyAppointments />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/chat" element={
        <PrivateRoute>
          <DashboardLayout>
            <Chat />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/favorites" element={
        <PrivateRoute>
          <DashboardLayout>
            <Favorites />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/journal-documents" element={
        <PrivateRoute>
          <DashboardLayout>
            <JournalDocuments />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/reviews" element={
        <PrivateRoute>
          <DashboardLayout>
            <ReviewsPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/payment-history" element={
        <PrivateRoute>
          <DashboardLayout>
            <PaymentHistoryPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/notifications" element={
        <PrivateRoute>
          <DashboardLayout>
            <NotificationsPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute>
          <DashboardLayout>
            <PersonalProfilePage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/settings" element={
        <PrivateRoute>
          <DashboardLayout>
            <AccountSettingsPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/help" element={
        <PrivateRoute>
          <DashboardLayout>
            <HelpCenterPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/therapy-dictionary" element={
        <PrivateRoute>
          <DashboardLayout>
            <TherapyDictionaryPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/privacy" element={
        <PrivateRoute>
          <DashboardLayout>
            <PrivacyCommitmentPage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};