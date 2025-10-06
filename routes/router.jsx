// src/router.jsx
import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Loader from "./../src/components/Loader";
import AuthGuard from "./../src/components/AuthGuard";       
import ParentElement from "./ParentElement";      

const Hero           = lazy(() => import("./../src/pages/Hero"));
const Login          = lazy(() => import("./../src/pages/Login"));
const Signup         = lazy(() => import("./../src/pages/Signup"));
const ForgetPassword = lazy(() => import("./../src/pages/ForgetPassword"));
const CreatePassword = lazy(() => import("./../src/pages/CreatePassword"));
const SuccessScreen  = lazy(() => import("./../src/pages/SuccessScreen"));
const Contact        = lazy(() => import("./../src/pages/Contact"));
const Subscription   = lazy(() => import("./../src/pages/Subscription"));
const EmailVerified  = lazy(() => import("./../src/pages/EmailVerified"));

const suspense = (node) => <Suspense fallback={<Loader />}>{node}</Suspense>;

// Layout for /Home/* so children render via <Outlet />
const HomeLayout = () => <Outlet />;

const GuardedOutlet = () => (
  <AuthGuard>
    <Outlet />
  </AuthGuard>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: suspense(<ParentElement />),
    children: [
      // public
      { index: true, element: suspense(<Login />) },
      { path: "Signup", element: suspense(<Signup />) },
      { path: "ForgetPassword", element: suspense(<ForgetPassword />) },
      { path: "Reset-Password/:uidb64/:token", element: suspense(<CreatePassword />) },
      { path: "Email-Verified/:uidb64/:token", element: suspense(<EmailVerified />) },
      { path: "Success", element: suspense(<SuccessScreen />) },

      // public Subscription
      { path: "Subscription", element: suspense(<Subscription />) },

      // protected area
      {
        element: <GuardedOutlet />,
        children: [
          {
            path: "Home",
            element: <HomeLayout />, // ⬅️ gives /Home its own Outlet
            children: [
              { index: true, element: suspense(<Hero />) },
              { path: "Contact", element: suspense(<Contact />) },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;





 // 🔒 Admin side
  // {
  //   path: "/admin",
  //   element: (
  //     <Suspense fallback={""}>
  //       <AdminParent />
  //     </Suspense>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: (
  //         <Suspense fallback={""}>
  //           <AdminDashboard />
  //         </Suspense>
  //       ),
  //     },
  //     {
  //       path: "users",
  //       element: (
  //         <Suspense fallback={""}>
  //           <AdminUsers />
  //         </Suspense>
  //       ),
  //     },
  //     {
  //       path: "parts",
  //       element: (
  //         <Suspense fallback={""}>
  //           <AdminParts />
  //         </Suspense>
  //       ),
  //     },
  //     {
  //       path: "analytics",
  //       element: (
  //         <Suspense fallback={""}>
  //           <AdminAnalytics />
  //         </Suspense>
  //       ),
  //     },
  //   ],
  // },
