import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from './layouts/MainLayout';

const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const AlmanacPage = lazy(() => import('../pages/AlmanacPage'));
const SchedulePage = lazy(() => import('../pages/SchedulePage'));
const ToolsPage = lazy(() => import('../pages/ToolsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CalendarPage />
            </Suspense>
          }
        />
        <Route
          path="almanac"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AlmanacPage />
            </Suspense>
          }
        />
        <Route
          path="schedule"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SchedulePage />
            </Suspense>
          }
        />
        <Route
          path="tools"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ToolsPage />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
