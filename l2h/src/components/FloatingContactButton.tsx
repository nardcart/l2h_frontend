import { useState, useRef, useEffect } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

interface FloatingContactButtonProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  whatsappMessage?: string;
  whatsappGroupUrl?: string;
  position?: 'left' | 'right';
  buttonImage?: string;
}

const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({ 
  whatsappNumber = '919205321167', 
  phoneNumber = '+919205321167',
  whatsappMessage = 'Hi, I would like to inquire about your services.',
  whatsappGroupUrl = 'https://wa.me/message/RPCZPHRPCA3EP1',
  position = 'left',
  buttonImage = '/images/whatsapp.png'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const toggleDropup = (): void => {
    setIsOpen(!isOpen);
  };

  const showDropup = (): void => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const hideDropup = (): void => {
    // Add a delay before closing to make it easier to move mouse to the dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms delay before closing
  };

  const positionClass = position === 'right' ? 'right-5 md:right-10' : 'left-5 md:left-10';

  return (
    <div 
      className={`fixed bottom-5 md:bottom-10 ${positionClass} z-[1000]`}
      onMouseEnter={showDropup}
      onMouseLeave={hideDropup}
    >
      {/* Main Button */}
      <button 
        className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#25d366] text-white border-none rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
        onClick={toggleDropup}
        aria-label="Contact us"
      >
        <img 
          src={buttonImage} 
          alt="Contact" 
          className="w-full h-auto rounded-full"
        />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute bottom-[70px] left-0 min-w-[140px] md:min-w-[160px] shadow-xl rounded-lg overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={showDropup}
        onMouseLeave={hideDropup}
      >
        {/* WhatsApp Group */}
        <a
          href={whatsappGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join WhatsApp Group"
          className="flex items-center px-4 py-3 bg-white text-gray-800 no-underline hover:bg-gray-100 transition-colors duration-200"
        >
          <FaWhatsapp className="text-[20px] md:text-[24px] mr-3 min-w-[20px] md:min-w-[24px] text-[#25d366]" />
          <span className="text-[12px] md:text-[14px] font-medium text-black">Connect Now</span>
        </a>

        {/* Phone Link */}
        <a
          href={`tel:${phoneNumber}`}
          aria-label="Call us"
          className="flex items-center px-4 py-3 bg-white text-gray-800 no-underline hover:bg-gray-100 transition-colors duration-200"
        >
          <FaPhone className="text-[20px] md:text-[24px] mr-3 min-w-[20px] md:min-w-[24px] text-[#4CAF50] rotate-[100deg]" />
          <span className="text-[12px] md:text-[14px] font-medium text-black">Call Us</span>
        </a>
      </div>
    </div>
  );
};

export default FloatingContactButton;

