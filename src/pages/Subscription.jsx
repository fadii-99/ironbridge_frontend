// src/pages/Subscription.jsx
import React, { useEffect, useState } from "react";
import GradientButton from "./../components/GradientButton";
import { HiCheckCircle } from "react-icons/hi";
import SmallLoader from "./../components/SmallLoader";
import { useUser } from "./../context/UserProvider";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("Access-Token") : null;
  const { user } = useUser(); // <-- yahan se plan_id lo
  const userPlanId = user?.user?.plan_id ?? null; // e.g. 1

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${serverUrl}/auth/plan/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data?.data)) setPlans(data.data);
        else setPlans([]);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (plans.length === 0 && !loading) {
    return (
      <section className="flex items-center justify-center min-h-screen text-white">
        <p className="text-gray-300">No subscription plans available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center text-center gap-7 px-6 text-white md:max-w-[90%] max-w-[95%] mx-auto sm:pt-30 pt-32">
      <h1 className="md:text-7xl sm:text-5xl text-4xl font-extrabold sm:leading-tight leading-15 sm:mb-12 mb-0">
        <span className="text-yellow-300">Choose</span> Your Plan
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-8">
        {plans.map((plan) => {
          // ✅ Token + plan match ⇒ activate this specific card
          const activated =
            Boolean(token) && userPlanId != null && Number(plan.id) === Number(userPlanId);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col justify-between 
                bg-gradient-to-br from-black via-black to-gray-600/10
                border shadow-lg overflow-hidden hover:scale-105 transition-transform
                ${activated ? "border-yellow-400/70" : "border-white/20"}`}
            >
              {activated && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded text-[10px] border bg-yellow-500/15 text-yellow-300 border-yellow-500/30">
                    Activated
                  </span>
                </div>
              )}

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-1">{plan.name}</h2>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-8">
                  Tier: <span className="text-yellow-300">{plan.tier}</span>
                </p>

                <p className="text-gray-300 text-[13px] pb-6 border-b border-gray-100/20">
                  {plan.description}
                </p>

                <ul className="space-y-3 text-[13px] text-gray-300 mb-8 text-left pt-8">
                  {(plan.features_list ?? []).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex items-center justify-center w-5 h-5">
                        <HiCheckCircle className="text-yellow-300 w-4 h-4" />
                      </span>
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons disabled as requested */}
              <GradientButton
                label={activated ? "Current Plan" : `${plan.button_emoji || ""} ${plan.button_text || "Subscribe"}`}
                onClick={() => {}}
                fullWidth
                disabled
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Subscription;
