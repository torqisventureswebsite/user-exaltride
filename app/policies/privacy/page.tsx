import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | ExaltRide",
  description: "Privacy Policy for ExaltRide - Your car accessories destination",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#001F5F] mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-6">Last Updated: December 2025</p>
          
          <p className="text-xs text-gray-500 italic mb-8">
            Disclaimer: In case of any discrepancy or difference, the English version will take precedence over the translation
          </p>

          <div className="prose prose-sm md:prose max-w-none text-gray-700">
            <p className="mb-6">
              We value the trust you place in us and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how Torqis Horizons Private Limited and its affiliates, group companies and related parties (collectively "Torqis, we, our, us") collect, use, share or otherwise process your personal data through Exaltride website www.exaltride.com, its website (hereinafter referred to as the "Platform").
            </p>

            <p className="mb-6">
              While you can browse sections of the Platform without the need of sharing any information with us, however, please note we do not offer any product or service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing out product/service, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Collection of Your Information</h2>
            <p className="mb-4">
              When you use our Platform, we collect and store your information which is provided by you from time to time. Once you give us your personal data, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide data by choosing not to use a particular service, product or feature on the Platform.
            </p>
            <p className="mb-4">
              We collect and analyse your personal data relating to your buying behavior, browsing patterns, preferences, and other information that you choose to provide while interacting with our Platform. We use this information to do internal research on our users' demographics, interests, usage trends, and behavior to better understand your needs and provide you with an enhanced user experience, protect and serve our users.
            </p>
            <p className="mb-6">
              We may collect personal data (such as email address, delivery address, name, phone number, credit card/debit card and other payment instrument details or medical or health related information) from you when you set up an account or transact with us or participate in any event or contest.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Use of Demographic / Profile Data / Your Information</h2>
            <p className="mb-4">
              We use your personal data to take and fulfill orders, deliver products and services, process payments, and communicate with you about orders, products and services, and promotional offers. We use your personal data to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services; inform you about online and offline offers, products, services, and updates; customize and enhance your experience; report to regulatory authorities wherever required, detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection of information.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Cookies</h2>
            <p className="mb-4">
              We use data collection devices such as "cookies" on certain pages of the Platform to help analyze our web page flow, measure promotional effectiveness, and promote trust and safety. "Cookies" are small files placed on your hard drive that assist us in providing our services. Cookies do not contain any of your personal data.
            </p>
            <p className="mb-6">
              We use cookies from third-party partners such as Google Analytics for marketing and analytical purposes. You can read more about how Google uses your personal data at{" "}
              <a href="https://www.google.com/intl/en/policies/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                https://www.google.com/intl/en/policies/privacy/
              </a>
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Sharing of Personal Data</h2>
            <p className="mb-6">
              We may disclose your personal data to third parties, such as our sellers, business partners. This disclosure may be required for us to provide you access to our products and services; for fulfillment of your orders; for enhancing your experience; for providing feedback on products; to collect payments from you; to comply with our legal obligations; to conduct market research or surveys; to enforce our Terms of Use; to facilitate our marketing and advertising activities; to analyze data; for customer service assistance; to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our product and services.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Security Precautions</h2>
            <p className="mb-6">
              We maintain reasonable physical, electronic and procedural safeguards to protect your information. Whenever you access your account information, we offer the use of a secure server. Once your information is in our possession, we adhere to our security guidelines to protect it against unauthorized access. However, by using the Platform, the users accept the inherent security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Choice/Opt-Out</h2>
            <p className="mb-6">
              We provide all users with the opportunity to opt-out of receiving non-essential (promotional, marketing-related) communications after setting up an account with us. If you do not wish to receive promotional communications from us, then please login into the Platform to unsubscribe/opt-out.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Children Information</h2>
            <p className="mb-6">
              Use of our Platform is available only to persons who can form a legally binding contract under the Indian Contract Act, 1872. We do not knowingly solicit or collect personal data from children under the age of 18 years.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Data Retention</h2>
            <p className="mb-6">
              We retain your personal data in accordance with applicable laws, for a period no longer than is required for the purpose for which it was collected or as required under any applicable law.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Your Rights</h2>
            <p className="mb-6">
              We take every reasonable step to ensure that your personal data that we process is accurate and, where necessary, kept up to date. You may access, correct, and update your personal data directly through the functionalities provided on the Platform. You may delete certain non-mandatory information by logging into our website and visiting Profile and Settings sections.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Grievance Officer</h2>
            <p className="mb-4">
              In accordance with Information Technology Act 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-semibold">Mr. Harsh Surana</p>
              <p>Designation: COO/Grievance Officer</p>
              <p>Torqis Horizons Pvt Ltd.</p>
              <p>IX-210, Tagore Gali, Gandhi Nagar,</p>
              <p>East Delhi, New Delhi - 110031, India</p>
              <p className="mt-2">
                Email: <a href="mailto:grievance@exaltride.com" className="text-blue-600 hover:underline">grievance@exaltride.com</a>
              </p>
            </div>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Customer Support</h2>
            <p className="mb-4">
              If you have a query, concern, or complaint in relation to collection or usage of your personal data under this Privacy Policy please contact us at{" "}
              <a href="mailto:grievance@exaltride.com" className="text-blue-600 hover:underline">grievance@exaltride.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
