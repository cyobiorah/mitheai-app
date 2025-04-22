const WaitlistForm = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <div className="w-full max-w-lg mx-auto p-8 bg-white/80 rounded-2xl shadow-xl glass-card text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">
          Experience Skedlii
        </h1>
        <p className="text-gray-700 mb-8">
          Join our exclusive waitlist and get priority updates, launch invites,
          and special perks.
        </p>

        <form
          action="https://formspree.io/f/mrbqgbll"
          method="POST"
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-full border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-gray-800 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-all"
          >
            Join Waitlist
          </button>
        </form>
      </div>
    </section>
  );
};

export default WaitlistForm;
