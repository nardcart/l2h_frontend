import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const PlacementPolicyViolation = () => {
  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              L2H Placement & Career Support Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Candidate guidelines for placement process
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6">Objective</h2>
            <p className="text-muted-foreground mb-6">
              The purpose of this policy is to empower students of L2H (Learn to Hire) to successfully transition into
              professional careers aligned with their skills, interests, and long-term aspirations.
            </p>
            <p className="text-muted-foreground mb-6">
              This policy ensures a structured, transparent, and merit-based placement process, offering equal
              opportunities to all eligible candidates. It emphasizes discipline, accountability, and job-readiness,
              while also providing personalized career guidance and industry exposure.
            </p>
            <p className="text-muted-foreground mb-6">
              This policy applies to all candidates enrolled in L2H career-focused programs.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Candidate Guidelines for Placement Process</h2>

            <h3 className="text-2xl font-bold mb-4 mt-8">1. Eligibility & Registration</h3>
            <h4 className="text-xl font-bold mb-3">Eligibility Criteria</h4>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>80% and above performance + 90% attendance:</strong> Eligible for placements without conditions.</li>
              <li><strong>60% - 80% performance:</strong> Must complete a mandatory revision module before applying.</li>
              <li>
                <strong>Below 60% performance:</strong> Required to complete the revision module, improve performance to
                minimum 80%, and then apply for placements.
              </li>
            </ul>
            <h4 className="text-xl font-bold mb-3">Registration Process</h4>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Eligible candidates must apply through the L2H LMS Portal via the Apply for Job section.</li>
              <li>Ensure all eligibility criteria are fulfilled before applying.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">2. Resume Submission & Approval</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Candidates must prepare resumes as per L2H standard format and faculty guidance.</li>
              <li>Resume submission must adhere to given timelines.</li>
              <li>All resumes will undergo faculty review and approval.</li>
              <li>Only approved resumes will be forwarded to the Placement Team.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">3. Professional Discipline</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Candidate behavior throughout training and placement activities will directly impact placement opportunities.</li>
              <li>Attendance in all scheduled interviews is mandatory.</li>
              <li>Missing interviews or showing lack of seriousness will lead to removal from the placement process.</li>
              <li>Maintain professional communication with faculty and placement team at all times.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">4. Job Offers & Acceptance</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Candidates must research companies thoroughly before accepting offers.</li>
              <li>Be prepared for immediate or short-notice joining.</li>
              <li>Companies may conduct a probation or observation period, typically 15 days.</li>
              <li>Selected candidates must follow company policies and understand job roles clearly before accepting.</li>
              <li>Selected candidates must submit required documents, including offer letter copy and photograph.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">5. Pre-Placement Sessions (PPS)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Attendance in all Pre-Placement Sessions is mandatory.</li>
              <li>These sessions help candidates understand company expectations.</li>
              <li>These sessions help candidates align career goals with opportunities.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">6. General Placement Guidelines</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Carry L2H ID card for all placement activities.</li>
              <li>Registration on the placement platform is mandatory.</li>
              <li>Once a candidate enters a placement process after a session, withdrawal is not allowed.</li>
              <li>Candidates must be open to opportunities within a 30 KM radius or PAN India, based on role.</li>
              <li>Candidates can accept a maximum of 2 job offers.</li>
              <li>L2H will provide up to 3 interview opportunities per candidate.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">7. Rejection & Improvement Process</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong>Technical rejections, 3 times:</strong> Candidate must complete a revision module before further support.</li>
              <li><strong>Soft skill rejections:</strong> Candidate must independently work on improvement.</li>
              <li><strong>Absence in interviews:</strong> Immediate disqualification from the placement process.</li>
              <li>After 3 unsuccessful interviews, placement support will be discontinued, except technical training support.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">8. Interview Preparation Expectations</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Strong understanding of core technical concepts.</li>
              <li>Completion of all projects and assignments.</li>
              <li>Continuous improvement in English communication and confidence.</li>
              <li>Stay active on official placement communication channels.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">9. Leave & Availability</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>All leave requests must be pre-approved by the Placement Team.</li>
              <li>Maximum allowed leave is 15 days.</li>
              <li>Unapproved leaves may lead to cancellation of placement support.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">10. Placement Duration</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>The placement support period extends up to 90 working days.</li>
              <li>Candidates must stay actively engaged and responsive.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">11. Alumni Placement Support</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Alumni seeking re-placement must complete prior employment obligations.</li>
              <li>Alumni must submit experience or relieving letter.</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">12. Policy Updates</h3>
            <p className="text-muted-foreground mb-6">
              L2H reserves the right to update or modify this policy at any time. Candidates are responsible for staying
              updated with the latest guidelines.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Placement Process Cancellation Criteria</h2>
            <p className="text-muted-foreground mb-4">
              The placement process will be cancelled if a candidate:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Refuses opportunities due to distance or location constraints.</li>
              <li>Misses interviews without valid prior notice.</li>
              <li>Rejects multiple offers without valid justification.</li>
              <li>Shows unprofessional behavior.</li>
              <li>Fails to join after selection.</li>
              <li>Does not respond to communication for 5 working days.</li>
              <li>Gets rejected twice due to soft skills issues.</li>
            </ul>

            <h2 className="text-3xl font-bold mb-6 mt-12">Soft Skills Development</h2>
            <p className="text-muted-foreground mb-4">L2H provides:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Workshops</li>
              <li>Practice sessions</li>
              <li>Interview training</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              However, improvement responsibility lies with the candidate. Consistent practice and self-effort are
              mandatory.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Candidate Accountability</h2>
            <p className="text-muted-foreground mb-4">Candidates are expected to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Take full ownership of their career growth.</li>
              <li>Actively work on technical and soft skills.</li>
              <li>Stay disciplined, responsive, and professional.</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              L2H acts as a career enabler, but success depends on candidate effort and commitment.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12">Policy Violations</h2>
            <p className="text-muted-foreground mb-6">
              Failure to comply with any policy guidelines will result in immediate termination of placement support.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlacementPolicyViolation;
