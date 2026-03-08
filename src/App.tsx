import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import { BookOpen, Building, GraduationCap, Home, Sparkles } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";
import { authProvider } from "./providers/auth";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import DepartmentLists from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "CPCuAo-A1xU4z-Vwtdu0",
                title: {
                  text: "Acme Academy", // Your App Name
                  icon: <Sparkles className="text-primary" />,
                }
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: { label: 'Home', icon: <Home /> }
                },
                {
                  name: 'subjects',
                  list: '/subjects',
                  create: '/subjects/create',
                  meta: { label: 'Subjects', icon: <BookOpen /> }
                },
                {
                  name: 'classes',
                  list: '/classes',
                  create: '/classes/create',
                  show: '/classes/show/:id',
                  meta: { label: 'Classes', icon: <GraduationCap /> }
                },
                {
                  name: 'departments',
                  list: '/departments',
                  create: '/departments/create',
                  meta: { label: 'Departments', icon: <Building /> }
                }
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<NavigateToResource resource="dashboard" />} />
                  <Route path="/" element={<Dashboard />} />

                  <Route path="/subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                  </Route>

                  <Route path="/classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>

                  <Route path="/departments">
                    <Route index element={<DepartmentLists />} />
                    <Route path="create" element={<DepartmentCreate />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={(options) => {
                return options.resource?.name + " | Acme Academy";
              }} />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
