import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Existing imports...
const ParentElement = lazy(() => import("./ParentElement"));
const Hero = lazy(() => import("./../src/pages/Hero"));
const Login = lazy(() => import("./../src/pages/Login"));
const Signup = lazy(() => import("./../src/pages/Signup"));
const ForgetPassword = lazy(() => import("./../src/pages/ForgetPassword"));
const VerifyOTP = lazy(() => import("./../src/pages/VerifyOTP"));
const CreatePassword = lazy(() => import("./../src/pages/CreatePassword"));
const SuccessScreen = lazy(() => import("./../src/pages/SuccessScreen"));
const Contact = lazy(() => import("./../src/pages/Contact"));
const Subscription = lazy(() => import("./../src/pages/Subscription"));


// 🔥 Admin imports
// const AdminParent = lazy(() => import("./AdminParent"));
// const AdminDashboard = lazy(() => import("./../src/pages/AdminDashboard"));
// const AdminUsers = lazy(() => import("./../src/pages/AdminUsers"));
// const AdminParts = lazy(() => import("./../src/pages/AdminParts"));
// const AdminAnalytics = lazy(() => import("./../src/pages/AdminAnalytics"));

const router = createBrowserRouter([
  // Public
  {
    path: "/",
    element: (
      <Suspense fallback={""}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/Signup",
    element: (
      <Suspense fallback={""}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/ForgetPassword",
    element: (
      <Suspense fallback={""}>
        <ForgetPassword />
      </Suspense>
    ),
  },
  {
    path: "/VerifyOTP",
    element: (
      <Suspense fallback={""}>
        <VerifyOTP />
      </Suspense>
    ),
  },
  {
    path: "/CreatePassword",
    element: (
      <Suspense fallback={""}>
        <CreatePassword />
      </Suspense>
    ),
  },
  {
    path: "/Success",
    element: (
      <Suspense fallback={""}>
        <SuccessScreen />
      </Suspense>
    ),
  },

  // User side
  {
    path: "/Home",
    element: (
      <Suspense fallback={""}>
        <ParentElement />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={""}>
            <Hero />
          </Suspense>
        ),
      }
      ,
      {
        path: "Contact",
        element: (
          <Suspense fallback={""}>
            <Contact />
          </Suspense>
        ),
      }
      ,
      {
        path: "Subscription",
        element: (
          <Suspense fallback={""}>
            <Subscription />
          </Suspense>
        ),
      },
    ],
  },

  
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
]);

export default router;
