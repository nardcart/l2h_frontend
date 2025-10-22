import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

interface Partner {
  name: string;
  role: string;
  image: string;
}

const partners: Partner[] = [
  {
    name: 'Khushi Subtamanian',
    role: 'Marketing Expert',
    image: '/images/kool1.png'
  },
  {
    name: 'Devansh Ganatra',
    role: 'Brand & Communication',
    image: '/images/subhum.png'
  },
  {
    name: 'Sumit Sahu',
    role: 'Business Development',
    image: '/images/kool.png'
  },
  {
    name: 'Meet Bhanushali',
    role: 'AI Specialist',
    image: '/images/meet.png'
  }
];

const Partnerships = () => {
  return (
    <div className="min-h-screen bg-[#f9f9fb] pt-16">
      {/* Main Content */}
      <section className="w-full max-w-7xl mx-auto px-5 py-20">
        {/* Section Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-[#24242D] text-center mb-16 tracking-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Our Partnerships
        </motion.h1>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]"
            >
              {/* Partner Image */}
              <div className="overflow-hidden rounded-t-[20px]">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-[350px] object-cover transition-transform duration-600 group-hover:scale-105"
                />
              </div>

              {/* Partner Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#24242D] mb-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {partner.name}
                </h3>
                <p className="text-sm font-medium text-[#444] opacity-80" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {partner.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partnerships;

