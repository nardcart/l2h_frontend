import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessStories = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-white py-8 relative overflow-hidden">
        <div className="relative h-[500px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center h-full w-full">
              {/* Left Content */}
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Success Stories
                </h1>
                
                {/* Feature List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">50,000+</span> Lives transformed
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">150%</span> Average salary increase
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">95%</span> Career advancement rate
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
                    Read Stories
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200">
                    Start Your Journey
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&auto=format" 
                    alt="Success Stories - Professional achievements and career growth" 
                    className="w-[110%] h-[520px] object-cover image-edge-fade -ml-[5%] -mt-[10px]"
                  />
                  {/* Optimized gradient overlays for seamless blending with white background */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Videos Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Story Videos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch real people share their transformation journeys with L2H
            </p>
          </div>

          {/* Bento Grid for Videos */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[280px]">
            {/* Large video - spans 2 columns and 2 rows */}
            <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <iframe
                src="https://www.youtube.com/embed/Qb2A_URHWKc"
                title="Success Story 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Regular sized video */}
            {/* <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <iframe
                src="https://www.youtube.com/embed/A3twBJ-kwFI"
                title="Success Story 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div> */}

            {/* Regular sized video */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <iframe
                src="https://www.youtube.com/embed/fXaGEgT9pVc"
                title="Success Story 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Regular sized video */}
            {/* <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <iframe
                src="https://www.youtube.com/embed/Hex4jzaByWQ"
                title="Success Story 4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div> */}

            {/* Regular sized video */}
            {/* <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <iframe
                src="https://www.youtube.com/embed/uoImotNo6Ak"
                title="Success Story 5"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div> */}
          </div>
        </div>
      </section>

      {/* Success Story Images Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimonials</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from our community
            </p>
          </div>

          {/* Masonry Bento Grid for Images */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {/* Image 1 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <img
                    src="/images/5.png"
                    alt="Success Story Testimonial"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 2 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <img
                    src="/images/6.png"
                    alt="Success Story Review"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 3 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <img
                    src="/images/7.png"
                    alt="Success Story Feedback"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 4 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <img
                    src="/images/8.png"
                    alt="Success Story Certificate"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 5 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <img
                    src="/images/9.png"
                    alt="Success Story Testimonial"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 6 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <img
                    src="/images/10.png"
                    alt="Success Story Achievement"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who have transformed their careers with L2H. 
            Your success story could be next!
          </p>
          <Link to="/courses">
            <Button size="lg" className="text-lg px-12 py-6 bg-white text-primary hover:bg-white/90 font-semibold shadow-xl hover:shadow-2xl transition-all">
              Explore Courses
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStories;