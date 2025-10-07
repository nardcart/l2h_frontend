import Footer from '@/components/Footer';
import { RefreshCw } from 'lucide-react';

const RefundsCancellation = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Refunds & Cancellation</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              At L2H, we follow a strict no-refund policy for all our programs and courses.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-8 rounded-r-lg mb-8">
              <ul className="space-y-6 text-muted-foreground text-lg">
                <li className="flex items-start">
                  <span className="mr-4 text-blue-600 text-2xl font-bold">•</span>
                  <span>Applicants may request to shift to a different batch up to 7 days before the commencement of the program.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-4 text-blue-600 text-2xl font-bold">•</span>
                  <span>The reserve seat fee is non-refundable for all programs.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-4 text-blue-600 text-2xl font-bold">•</span>
                  <span>Registrations made during sales or promotional offers are strictly non-refundable and non-transferable.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RefundsCancellation;

