import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Loader from "./../src/components/Loader";
import AuthGuard from "./../src/components/AuthGuard";
import ParentElement from "./ParentElement";
import AdminParent from "./AdminParent";

const Hero           = lazy(() => import("./../src/pages/Hero"));
const Login          = lazy(() => import("./../src/pages/Login"));
const Signup         = lazy(() => import("./../src/pages/Signup"));
const ForgetPassword = lazy(() => import("./../src/pages/ForgetPassword"));
const CreatePassword = lazy(() => import("./../src/pages/CreatePassword"));
const SuccessScreen  = lazy(() => import("./../src/pages/SuccessScreen"));
const Contact        = lazy(() => import("./../src/pages/Contact"));
const Subscription   = lazy(() => import("./../src/pages/Subscription"));
const EmailVerified  = lazy(() => import("./../src/pages/EmailVerified"));

const AdminDashboard = lazy(() => import("./../src/admin/AdminDashboard"));
const AdminParts     = lazy(() => import("./../src/admin/AdminParts"));
const AdminLogin = lazy(() => import("./../src/admin/AdminLogin"));


const suspense = (node) => <Suspense fallback={<Loader />}>{node}</Suspense>;

const HomeLayout = () => <Outlet />;

const GuardedOutlet = () => (
  <AuthGuard>
    <Outlet />
  </AuthGuard>
);

const router = createBrowserRouter([
  // ✅ Admin routes
  {
  path: "/AdminLogin",
  element: suspense(<AdminLogin />),
},
  {
    path: "/admin",
    element: (
      <Suspense fallback={""}>
        <AdminParent />
      </Suspense>
    ),
    children: [
      { index: true, element: suspense(<AdminDashboard />) },
      { path: "parts", element: suspense(<AdminParts />) },
    ],
  },

  // ✅ Public + Protected routes
  {
    path: "/",
    element: suspense(<ParentElement />),
    children: [
      // Public
      { index: true, element: suspense(<Login />) },
      { path: "Signup", element: suspense(<Signup />) },
      { path: "ForgetPassword", element: suspense(<ForgetPassword />) },
      { path: "Reset-Password/:uidb64/:token", element: suspense(<CreatePassword />) },
      { path: "Email-Verified/:uidb64/:token", element: suspense(<EmailVerified />) },
      { path: "Success", element: suspense(<SuccessScreen />) },
      { path: "Subscription", element: suspense(<Subscription />) },
      { path: "Contact", element: suspense(<Contact />) },

      // Protected area
      {
        element: <GuardedOutlet />,
        children: [
          {
            path: "Home",
            element: <HomeLayout />,
            children: [{ index: true, element: suspense(<Hero />) }],
          },
        ],
      },
    ],
  },
]);

export default router;
