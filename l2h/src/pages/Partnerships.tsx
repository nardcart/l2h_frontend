import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Partnerships = () => {
  return (
    <div className="min-h-screen bg-[#f9f9fb] pt-16">
      {/* Main Content */}
      <section className="w-full max-w-7xl mx-auto px-5 py-20 flex items-center justify-center min-h-[60vh]">
        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1
            className="text-5xl md:text-6xl font-bold text-[#24242D] mb-6 tracking-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Coming Soon
          </h1>
          <p
            className="text-xl md:text-2xl text-[#444] opacity-70"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            We're working on something exciting. Stay tuned!
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Partnerships;




