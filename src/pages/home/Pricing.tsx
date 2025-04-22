import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { featureRows, pricingPlans } from "./constants";

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const returnPrice = (plan: any) => {
    switch (plan.name) {
      case "Free":
        return "$0";
      case "Starter":
        return yearly ? `$${plan.yearly}` : `$${plan.price}`;
      case "Pro":
        return yearly ? `$${plan.yearly}` : `$${plan.price}`;
      case "Business":
        return yearly ? `$${plan.yearly}` : `$${plan.price}`;
      default:
        return "$0";
    }
  };

  return (
    <section id="plans" className="py-24 bg-gray-100">
      <div className="container mx-auto px-6">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Payment Plans
        </motion.h3>
        <div className="mb-12 flex justify-center items-center gap-4">
          <span className="font-medium">Monthly</span>
          <label
            htmlFor="yearly"
            className="relative inline-flex items-center cursor-pointer"
          >
            <span className="sr-only">Toggle yearly billing</span>
            <input
              type="checkbox"
              id="yearly"
              className="sr-only peer"
              checked={yearly}
              onChange={(e) => setYearly(e.target.checked)}
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-all"></div>
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-all"></div>
          </label>
          <span className="font-medium text-indigo-600">Yearly (Save 20%)</span>
        </div>
        <div className="grid md:grid-cols-4 gap-10">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`pricing-card glass-card p-8 rounded-2xl border-2 border-${plan.badgeColor}-400`}
            >
              <h4 className="text-2xl font-semibold mb-2">{plan.name}</h4>
              <span
                className={`inline-block bg-${plan.badgeColor}-100 text-${plan.badgeColor}-700 text-xs px-2 py-1 rounded mb-2`}
              >
                {plan.badge}
              </span>
              <p className="text-4xl font-bold mb-6">
                {returnPrice(plan)}
                {plan.price !== 0 && (
                  <span className="text-base font-normal text-gray-600">
                    {yearly ? "/yr" : "/mo"}
                  </span>
                )}
              </p>
              <ul className="mb-6 space-y-2 text-gray-700 text-sm">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <motion.button
                className={`w-full ${plan.buttonColor} text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors`}
              >
                {plan.button}
              </motion.button>
            </motion.div>
          ))}
        </div>
        <div className="mt-8">
          <button
            onClick={() => setShowComparison((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium shadow-sm hover:bg-indigo-100 transition"
            aria-expanded={showComparison}
            aria-controls="pricing-comparison-table"
          >
            {showComparison ? (
              <>
                <ChevronUpIcon className="w-5 h-5" />
                Hide Feature Comparison
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-5 h-5" />
                Show Feature Comparison
              </>
            )}
          </button>
          <div
            id="pricing-comparison-table"
            className={`transition-all duration-300 overflow-hidden ${
              showComparison ? "max-h-[1000px] mt-4" : "max-h-0"
            }`}
            style={{ willChange: "max-height" }}
          >
            <div className="overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border"></th>
                      {pricingPlans.map((plan) => (
                        <th
                          key={plan.name}
                          className="py-2 px-4 border font-semibold"
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureRows.map((row) => (
                      <tr key={row.key}>
                        <td className="py-2 px-4 border">{row.label}</td>
                        {pricingPlans.map((plan) => (
                          <td
                            key={plan.name + row.key}
                            className="py-2 px-4 border text-center"
                          >
                            {plan[row.key as keyof typeof plan]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
