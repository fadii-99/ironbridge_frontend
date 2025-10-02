import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "./../src/components/Loader";



const ParentElement = lazy(() => import("./ParentElement"));
const Hero = lazy(() => import("./../src/pages/Hero"));
const Login = lazy(() => import("./../src/pages/Login"));
const Signup = lazy(() => import("./../src/pages/Signup"));
const ForgetPassword = lazy(() => import("./../src/pages/ForgetPassword"));
const CreatePassword = lazy(() => import("./../src/pages/CreatePassword"));
const SuccessScreen = lazy(() => import("./../src/pages/SuccessScreen"));
const Contact = lazy(() => import("./../src/pages/Contact"));
const Subscription = lazy(() => import("./../src/pages/Subscription"));

const EmailVerified = lazy(() => import("./../src/pages/EmailVerified"));


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/Signup",
    element: (
      <Suspense fallback={<Loader />}>
        <Signup />
      </Suspense>
    ),
  },
   {
    path: "/Email-Verified/:uidb64/:token",
    element: (
      <Suspense fallback={<Loader />}>
        <EmailVerified />
      </Suspense>
    ),
  },
  {
    path: "/ForgetPassword",
    element: (
      <Suspense fallback={<Loader />}>
        <ForgetPassword />
      </Suspense>
    ),
  },
    {
      path: "/Reset-Password/:uidb64/:token",
      element: (
        <Suspense fallback={<Loader />}>
          <CreatePassword />
        </Suspense>
      ),
    },
  {
    path: "/Success",
    element: (
      <Suspense fallback={<Loader />}>
        <SuccessScreen />
      </Suspense>
    ),
  },

  // User side
  {
    path: "/Home",
    element: (
      <Suspense fallback={<Loader />}>
        <ParentElement />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Hero />
          </Suspense>
        ),
      },
      {
        path: "Contact",
        element: (
          <Suspense fallback={<Loader />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "Subscription",
        element: (
          <Suspense fallback={<Loader />}>
            <Subscription />
          </Suspense>
        ),
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
