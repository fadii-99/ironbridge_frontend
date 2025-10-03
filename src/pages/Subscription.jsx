import React, { useEffect, useState } from "react";
import GradientButton from "./../components/GradientButton";
import { HiCheckCircle } from "react-icons/hi";
import SmallLoader from "./../components/SmallLoader";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("Access-Token");

        const res = await fetch(`${serverUrl}/auth/plan/`, {
          method: "POST", // 👈 tumhari API ke hisaab se
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        // console.log("Plans API response:", data);

        if (res.ok && Array.isArray(data?.data)) {
          setPlans(data.data); // 👈 directly array le liya
        } else {
          setPlans([]);
        }
      } catch (err) {
        // console.error("Failed to fetch plans:", err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-black text-white">
        <SmallLoader size={15} />
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section className="flex items-center justify-center min-h-screen text-white">
        <p className="text-gray-300">No subscription plans available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center text-center gap-7 px-6 text-white md:max-w-[90%] max-w-[95%] mx-auto sm:pt-30 pt-32">
      {/* Big Heading */}
      <h1 className="md:text-7xl sm:text-5xl text-4xl font-extrabold sm:leading-tight leading-15 sm:mb-12 mb-0">
        <span className="text-yellow-300">Choose</span> Your Plan
      </h1>

      {/* Cards */} 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-2xl p-8 flex flex-col justify-between 
              bg-gradient-to-br from-black via-black to-gray-600/10
              border border-white/20 shadow-lg overflow-hidden 
              hover:scale-105 transition-transform"
          >
            <div className="relative z-10">
              {/* Plan Name */}
              <h2 className="text-3xl font-bold mb-1">{plan.name}</h2>

              {/* Tier */}
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-8">
                Tier: <span className="text-yellow-300">{plan.tier}</span>
              </p>

              {/* Description */}
              <p className="text-gray-300 text-[13px] pb-6 border-b border-gray-100/20">{plan.description}</p>

              {/* Features List */}
                <ul className="space-y-3 text-[13px] text-gray-300 mb-8 text-left pt-8">
                {plan.features_list?.slice(0, -1).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5">
                      <HiCheckCircle className="text-yellow-300 w-4 h-4" />
                    </span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disabled Button */}
            <GradientButton
              label={`${plan.button_emoji || ""} ${plan.button_text || "Subscribe"}`}
              onClick={() => console.log("Subscribe clicked:", plan)}
              fullWidth
              disabled // 👈 abhi disable rakha
            />
          </div>
        ))}
      </div>
    </section>
  );
};


export default Subscription;
