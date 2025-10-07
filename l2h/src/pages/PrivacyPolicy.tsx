import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
            <h2 className="text-3xl font-bold mb-6">Privacy Policy for L2H</h2>
            <p className="text-muted-foreground mb-6">
              At L2H, accessible from www.l2h.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by L2H and how we use it.
            </p>
            <p className="text-muted-foreground mb-6">
              If you have additional questions or need more information about our Privacy Policy, please do not hesitate to contact us.
            </p>
            <p className="text-muted-foreground mb-6">
              This Privacy Policy applies only to our online activities and is valid for visitors to our website with regard to the information that they share and/or collect on L2H. This policy does not apply to any information collected offline or via channels other than this website.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Consent</h2>
            <p className="text-muted-foreground mb-6">
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Information We Collect</h2>
            <p className="text-muted-foreground mb-6">
              The personal information that you are asked to provide, along with the reasons for providing it, will be made clear to you at the time we request it.
            </p>
            <p className="text-muted-foreground mb-6">
              If you contact us directly, we may receive additional details such as your name, email address, phone number, the contents of your message and/or attachments, and any other information you choose to share.
            </p>
            <p className="text-muted-foreground mb-6">
              When you register for an account, we may ask for your contact details, including but not limited to: name, company name, address, email address, and telephone number.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you directly or through our partners, including for customer service, updates, and promotional purposes</li>
              <li>Send you emails</li>
              <li>Detect and prevent fraud</li>
            </ul>

            <h2 className="text-3xl font-bold mb-6 mt-12">Log Files</h2>
            <p className="text-muted-foreground mb-6">
              L2H follows a standard procedure of using log files. These files log visitors when they visit websites—a common practice for hosting companies and part of hosting service analytics.
            </p>
            <p className="text-muted-foreground mb-6">
              The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and the number of clicks. This data is not linked to personally identifiable information. Its purpose is to analyze trends, administer the site, track user movement, and gather demographic information.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Cookies and Web Beacons</h2>
            <p className="text-muted-foreground mb-6">
              Like many other websites, L2H uses cookies. These cookies store information such as visitors' preferences and the pages visited on our website. The information is used to enhance user experience by customizing content based on browser type and/or other information.
            </p>
            <p className="text-muted-foreground mb-6">
              For more general information on cookies, please read "What Are Cookies".
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Advertising Partners Privacy Policies</h2>
            <p className="text-muted-foreground mb-6">
              You may consult this list to find the Privacy Policy for each of L2H's advertising partners.
            </p>
            <p className="text-muted-foreground mb-6">
              Third-party ad servers or networks may use technologies like cookies, JavaScript, or web beacons in their advertisements and links on L2H. These are sent directly to your browser and automatically receive your IP address. Such technologies measure advertising effectiveness and personalize content.
            </p>
            <p className="text-muted-foreground mb-6">
              Please note that L2H has no access to or control over cookies used by third-party advertisers.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Third-Party Privacy Policies</h2>
            <p className="text-muted-foreground mb-6">
              L2H's Privacy Policy does not extend to other advertisers or websites. We encourage you to review the respective privacy policies of third-party ad servers for detailed information, including their practices and how to opt out.
            </p>
            <p className="text-muted-foreground mb-6">
              You can disable cookies through your browser settings. For detailed information on cookie management, please visit your browser's official website.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p className="text-muted-foreground mb-4">
              Under the CCPA, Indian consumers have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Request that a business disclose the categories and specific pieces of personal data it has collected.</li>
              <li>Request deletion of personal data collected.</li>
              <li>Request that a business not sell their personal data.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              If you make a request, we will respond within one month. To exercise these rights, please contact us.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">GDPR Data Protection Rights</h2>
            <p className="text-muted-foreground mb-4">
              We want to ensure you are fully aware of your data protection rights. Every user is entitled to the following:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>The right to access</strong> – You may request copies of your personal data. A small fee may apply.</li>
              <li><strong>The right to rectification</strong> – You may request corrections to inaccurate or incomplete information.</li>
              <li><strong>The right to erasure</strong> – You may request deletion of your personal data, under certain conditions.</li>
              <li><strong>The right to restrict processing</strong> – You may request that we limit the processing of your data, under certain conditions.</li>
              <li><strong>The right to object to processing</strong> – You may object to how we process your data, under certain conditions.</li>
              <li><strong>The right to data portability</strong> – You may request that we transfer your collected data to another organization, or directly to you, under certain conditions.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              We will respond to requests within one month. To exercise these rights, please contact us.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Children's Information</h2>
            <p className="text-muted-foreground mb-6">
              Protecting children's privacy online is a key priority for us. We encourage parents and guardians to monitor and guide their children's online activity.
            </p>
            <p className="text-muted-foreground mb-6">
              L2H does not knowingly collect any Personal Identifiable Information from children under 13. If you believe your child has provided such information on our website, please contact us immediately. We will make every effort to promptly remove such data from our records.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg mb-6">
              <p className="text-muted-foreground mb-2"><strong>Email:</strong> privacy@l2h.in</p>
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

export default PrivacyPolicy;

