import React from "react";
import GradientButton from "./../components/GradientButton";
import { HiCheckCircle } from "react-icons/hi"; // icon for features

const Subscription = () => {
  const plans = [
    {
      title: "Tier 1",
      price: "Lorem ipsum",
      features: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
    },
    {
      title: "Tier 2",
      price: "Lorem ipsum",
      features: [
        "Lorem ipsum dolor sit amet",
        "Ut enim ad minim veniam",
        "Quis nostrud exercitation",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
    },
    {
      title: "Tier 3",
      price: "Lorem ipsum",
      features: [
        "Lorem ipsum dolor sit amet",
        "Duis aute irure dolor",
        "Excepteur sint occaecat",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center text-center gap-7 px-6 text-white md:max-w-[90%] max-w-[95%] mx-auto min-h-screen sm:pt-20 pt-32 ">
      {/* Big Heading */}
      <h1 className="md:text-7xl sm:text-5xl text-4xl font-extrabold sm:leading-tight leading-15 sm:mb-12 mb-0">
        <span className="text-yellow-300">Choose</span> Your Plan
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="relative rounded-2xl p-8 flex flex-col justify-between 
            bg-gradient-to-br from-black via-black to-gray-600/10
            border border-white/20 shadow-lg overflow-hidden 
            hover:scale-105 transition-transform"
          >
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3">{plan.title}</h2>
              <p className="text-yellow-300 text-lg font-semibold mb-6">
                {plan.price}
              </p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <HiCheckCircle className="text-yellow-300 mt-[2px]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <GradientButton label="Subscribe" onClick={() => {}} fullWidth />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Subscription;
