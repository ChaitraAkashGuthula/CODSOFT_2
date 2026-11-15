import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DineDesk",
  description:
    "Terms and conditions governing the use of DineDesk restaurant ordering, table reservation, and hospitality management services.",
};

export default function TermsPage() {
  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm text-[#3E4152] leading-relaxed">
      <header className="border-b border-[#E8E8E8] pb-6 mb-6">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E23744]">
          Legal Documentation
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] mt-1 mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-[#686B78]">
          Last revised: November 15, 2026 • Effective immediately across all DineDesk services.
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using the DineDesk platform, including browsing our digital menu, booking table reservations, or placing dine-in, takeaway, or delivery orders, you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            2. Dining Orders & Real-Time Fulfillment
          </h2>
          <p>
            Orders placed through DineDesk are transmitted in real time to the restaurant kitchen display system (KDS). Once an order enters preparation, modifications or cancellations are subject to kitchen discretion. All menu items, pricing (including applicable local taxes and optional gratuity), and availability are subject to change without prior notice.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            3. Table Reservations & Seating Policy
          </h2>
          <p>
            Table bookings are confirmed based on real-time dining room capacity and table configurations. We request guests arrive within 15 minutes of their confirmed booking slot. In the event of no-show or late arrivals beyond the grace period, reserved tables may be released to waiting diners.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            4. Dietary & Allergen Disclaimer
          </h2>
          <p>
            While our menu features detailed dietary indicators (Vegetarian, Vegan, Gluten-Free) and allergen badges, dishes are prepared in an open commercial kitchen where cross-contact with gluten, nuts, and dairy may occur. Guests with severe sensitivities must communicate directly with floor staff before ordering.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            5. Staff Portal & Role-Based Access
          </h2>
          <p>
            Access to the Kitchen Display System (/kitchen) and Management Console (/admin) is strictly restricted to authorized restaurant personnel. Unauthorized attempts to bypass access controls or probe internal endpoints are strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            6. Limitation of Liability
          </h2>
          <p>
            DineDesk provides this software platform on an &quot;as is&quot; and &quot;as available&quot; basis. We are not liable for incidental or consequential damages arising from service interruptions, payment provider downtimes, or technical connectivity faults.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-[#1C1C1C] mb-2">
            7. Contact Information
          </h2>
          <p>
            For questions or legal inquiries regarding these terms, please contact our support team at{" "}
            <a href="mailto:legal@dinedesk.restaurant" className="text-[#E23744] font-semibold hover:underline">
              legal@dinedesk.restaurant
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
