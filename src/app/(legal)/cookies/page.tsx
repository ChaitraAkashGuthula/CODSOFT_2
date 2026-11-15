import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | DineDesk",
  description:
    "Information regarding our use of cookies, local storage, and session tokens to deliver restaurant ordering and security.",
};

export default function CookiesPage() {
  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm text-[#3E4152] leading-relaxed">
      <header className="border-b border-[#E8E8E8] pb-6 mb-6">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E23744]">
          Legal Documentation
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] mt-1 mb-2">
          Cookie Policy
        </h1>
        <p className="text-xs text-[#686B78]">
          Last revised: November 15, 2026 • Details our transparent storage practices.
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            1. What Are Cookies and Local Storage?
          </h2>
          <p>
            Cookies and browser storage mechanisms (such as <code>localStorage</code>) are small text fragments stored on your device when you interact with modern web applications. They allow our platform to remember your selections as you browse courses or navigate across dining steps.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            2. Categories of Storage We Use
          </h2>
          <div className="space-y-3 mt-3">
            <div className="rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-3.5">
              <h3 className="font-bold text-xs text-[#1C1C1C]">A. Strictly Essential Storage (Always Active)</h3>
              <p className="text-xs text-[#686B78] mt-1">
                Required for core dining functionality. Includes maintaining your itemized cart (<code>dinedesk-storage</code> in <code>localStorage</code>), table selection number, and role authentication tokens (<code>dinedesk_role</code>) used by security middleware to protect staff consoles.
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-3.5">
              <h3 className="font-bold text-xs text-[#1C1C1C]">B. Preference & Consent Storage</h3>
              <p className="text-xs text-[#686B78] mt-1">
                Records your privacy banner preferences (<code>app_cookie_consent_v1</code>) so we do not repeatedly interrupt your dining session with prompts on subsequent visits.
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-3.5">
              <h3 className="font-bold text-xs text-[#1C1C1C]">C. Performance & Live Telemetry</h3>
              <p className="text-xs text-[#686B78] mt-1">
                Enables low-latency Server-Sent Events (SSE) connections for kitchen tickets and live order progress tracking. No cross-site ad tracking cookies are deployed.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            3. Managing Your Choices
          </h2>
          <p>
            You can modify your preferences at any time through our bottom-right cookie control widget or through your browser settings. Please note that disabling essential storage may prevent you from saving dishes to your cart or viewing table booking confirmations.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            4. Policy Inquiries
          </h2>
          <p>
            For questions about our technical storage mechanisms, contact{" "}
            <a href="mailto:support@dinedesk.restaurant" className="text-[#E23744] font-semibold hover:underline">
              support@dinedesk.restaurant
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
