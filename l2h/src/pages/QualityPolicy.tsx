import Footer from '@/components/Footer';
import { Award } from 'lucide-react';

const QualityPolicy = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Policy</h1>
            <p className="text-xl text-muted-foreground">
              Our commitment to excellence, integrity, and innovation
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              At L2H, our Quality Policy is guided by a strong commitment to excellence, integrity, and innovation. The following principles and behaviors define the way we work:
            </p>

            <div className="space-y-8 mb-12">
              {/* Principle 1 */}
              <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-l-4 border-blue-600 p-6 rounded-r-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-blue-900 dark:text-blue-100">
                  Mutually Beneficial Partnerships
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to create meaningful partnerships with our learners and interns, ensuring their long-term success by understanding their needs and supporting them in exploring and excelling in their chosen fields.
                </p>
              </div>

              {/* Principle 2 */}
              <div className="bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border-l-4 border-green-600 p-6 rounded-r-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-green-900 dark:text-green-100">
                  Commitment to Consistency
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We uphold our commitments to quality, cost-effectiveness, and timely delivery across all our programs and services.
                </p>
              </div>

              {/* Principle 3 */}
              <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 border-l-4 border-purple-600 p-6 rounded-r-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-purple-900 dark:text-purple-100">
                  Proactive Risk Management
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Through systematic analysis and preventive practices, we ensure reliability and minimize risks at every level of our operations.
                </p>
              </div>

              {/* Principle 4 */}
              <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 border-l-4 border-orange-600 p-6 rounded-r-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-orange-900 dark:text-orange-100">
                  Continuous Improvement
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We continuously enhance our standards by leveraging constructive feedback, defined benchmarks, industry best practices, and learner surveys to drive innovation and growth.
                </p>
              </div>

              {/* Principle 5 */}
              <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800 border-l-4 border-indigo-600 p-6 rounded-r-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-indigo-900 dark:text-indigo-100">
                  Skill Development & Empowerment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are dedicated to developing the skills of our team through effective training, fostering innovation, empowering decision-making, and ensuring transparency and accountability.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-2xl shadow-lg mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Goal</h2>
              <p className="text-lg leading-relaxed mb-4">
                Our goal is to make L2H a leader in skill development and learning services, delivering world-class educational and training programs. Every member of our organization is responsible for ensuring complete satisfaction of our learners by meeting and exceeding their expectations with best-in-class services.
              </p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-2xl font-bold text-center">
                  At L2H, 100% learner success and satisfaction is our aim — 100% of the time.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about our Quality Policy or wish to provide feedback, please contact us:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg mb-6">
              <p className="text-muted-foreground mb-2"><strong>Email:</strong> quality@l2h.in</p>
              <p className="text-muted-foreground mb-2"><strong>Phone:</strong> +91-98765-43210</p>
              <p className="text-muted-foreground"><strong>Address:</strong> Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QualityPolicy;

