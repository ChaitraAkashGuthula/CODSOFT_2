import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DineDesk",
  description:
    "Privacy policy detailing how DineDesk collects, stores, processes, and safeguards guest and transaction information.",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm text-[#3E4152] leading-relaxed">
      <header className="border-b border-[#E8E8E8] pb-6 mb-6">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E23744]">
          Legal Documentation
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] mt-1 mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#686B78]">
          Last revised: November 15, 2026 • Compliant with global privacy standards.
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            1. Information We Collect
          </h2>
          <p>
            When using DineDesk, we collect information necessary to process your meal and seat your party. This includes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
            <li><strong>Contact details:</strong> Full name, phone number, and email address provided during checkout or table reservation.</li>
            <li><strong>Order details:</strong> Selected menu items, custom preparation notes, table assignments, and service preference (dine-in, takeaway, delivery).</li>
            <li><strong>Technical identifiers:</strong> Device IP, browser characteristics, and session state stored locally to maintain your cart and active table session.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            2. How We Use Your Data
          </h2>
          <p>
            Collected data is utilized strictly for operational dining fulfillment:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
            <li>Dispatching tickets to the kitchen display system (KDS) and alerting staff of special dietary requests.</li>
            <li>Transmitting live order status updates via Server-Sent Events (SSE).</li>
            <li>Confirming table reservations and managing dining floor capacity.</li>
            <li>Generating aggregated, anonymized sales telemetry for restaurant operations.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            3. Payment Processing & Card Security
          </h2>
          <p>
            Payment transactions are processed through tokenized, PCI-DSS compliant sandbox gateways. DineDesk never stores raw credit or debit card numbers on our relational database servers.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            4. Data Retention & Third Parties
          </h2>
          <p>
            We do not sell, rent, or monetize your personal information to third-party advertisers. Order history and reservation logs are retained only as long as necessary for tax compliance and operational auditing.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            5. Your Rights
          </h2>
          <p>
            Depending on your jurisdiction, you have the right to request access to your stored personal records, request corrections, or ask for the deletion of your customer history by reaching out to our data privacy officer at{" "}
            <a href="mailto:privacy@dinedesk.restaurant" className="text-[#E23744] font-semibold hover:underline">
              privacy@dinedesk.restaurant
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
