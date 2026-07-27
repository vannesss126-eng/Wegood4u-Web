/**
 * Legal document content for /privacy and /terms.
 *
 * PRIVACY is ported from the client's live WordPress policy
 * (wegood4u.com/privacy-policy) — their own wording, kept faithfully. Internal
 * scaffolding on the WP page (app-store snippets, "implementation notes") was
 * dropped; the bracketed contact placeholders were resolved to the site's real
 * details (Say Sheji Group Sdn Bhd, enquiry@wegood4u.com — the verified address
 * the rest of the site uses, in place of the policy's unmonitored support@).
 *
 * TERMS is a NEW draft: no terms page existed on WordPress (all /terms* URLs
 * 404). It is standard, service-appropriate boilerplate written for Wegood4u's
 * model and MUST be reviewed by the client's legal counsel before cutover — it
 * is a starting point, not vetted legal advice.
 *
 * Bodies are first-party markdown rendered through <StoryProse> (react-markdown,
 * no raw HTML) — the same safe renderer as /news.
 */

export type LegalDoc = {
  title: string;
  /** Human date shown under the title. */
  updated: string;
  /** One-paragraph intro above the body. */
  intro: string;
  /** Markdown body (## sections). */
  body: string;
};

export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  updated: "25 July 2026",
  intro:
    "Wegood4u (“we”, “us”, “our”), operated by Say Sheji Group Sdn Bhd, runs the Wegood4u mobile app and website (the “Service”). This policy explains what information we collect, how we use it, who we share it with, and the choices you have. Questions? Email enquiry@wegood4u.com.",
  body: `## 1. Quick summary

In plain language:

- We collect information you provide (account details, photos, content).
- We collect device and usage data to run and improve the app.
- We may collect location and photos — only with your permission.
- We use data to operate the app, provide rewards, deliver content, and improve the Service.
- You control many settings (notifications, profile visibility, and data deletion).
- **We do not sell your personal information.**

## 2. Information we collect

### A. Information you give us

- **Account info:** name, email, phone number, username, password.
- **Profile & preferences:** interests, profile photo, bio.
- **Content you submit:** photos (selfies, venue photos), written reviews, videos, ratings, comments.
- **Communication:** messages to support, feedback, contest entries.

### B. Device & usage information (collected automatically)

- Device type, OS version, app version, unique identifiers (device ID), IP address.
- Analytics: pages/screens visited, features used, timestamps, crash logs, performance metrics.

### C. Location data

With your consent, we may collect precise (GPS) or approximate location to power features like nearby partners and to validate visits. Location collection is optional and you can revoke permission at any time.

### D. Photos & media

When you upload photos or videos (for example, a selfie and a venue photo to claim a visit), you grant us the rights to store and use that content in accordance with this policy (see “Sharing & disclosure” below).

### E. Payment & transaction data

If you purchase premium services, we collect the billing details and transaction records needed to process the purchase. Payments are handled by third-party providers, and we do not store full card details on our servers — we rely on the processor's secure tokenization.

### F. Third-party & aggregated data

- If you sign up using a third-party service (Google, Facebook), we receive the data that service provides (name, email, profile photo).
- We may combine your data with public or partner data to improve recommendations.

## 3. How we use your information

We use information to:

- Provide and maintain the Service (account management, rewards distribution).
- Verify visit submissions and validate rewards.
- Personalise content, recommendations, and partner suggestions.
- Communicate with you (notifications, support replies, account alerts).
- Improve, analyse, and develop features (analytics, testing).
- Prevent fraud and enforce our Terms of Service.
- Deliver marketing and promotional campaigns — only if you have opted in.
- Comply with our legal obligations.

## 4. Sharing & disclosure

We may share your information with:

- **Service providers & processors:** hosting, analytics, payment processing, and email delivery. They act as processors bound by contract.
- **Business partners:** to provide rewards, validate visits, or power features — only the data necessary is shared.
- **Legal & safety:** when required by law, to protect rights and safety, or in response to lawful requests.
- **Business transfers:** in a merger, acquisition, or sale of assets, your information may be transferred subject to notice.
- **Public & community content:** content you choose to publish (photos, reviews) may be visible to other users and may be used by us for marketing. Do not upload content you do not want shared publicly.

**We do not sell your personal information.**

## 5. Your choices & controls

- **Access & edit:** update your profile information from your account settings.
- **Delete account:** you can request account deletion; we will remove personal data subject to legal retention requirements.
- **Opt out of marketing:** unsubscribe from email or push marketing at any time via settings or the unsubscribe link.
- **Location & camera permissions:** enable or disable these in your device settings. Revoking location may affect some features.
- **Data export:** you may request a copy of your personal data in a common machine-readable format.

To exercise any of these rights, email enquiry@wegood4u.com.

## 6. Security

We use administrative, technical, and physical safeguards to protect your data (encryption in transit, secure servers, access controls). No service is 100% secure — if you suspect a breach, please report it to enquiry@wegood4u.com.

## 7. Data retention

We retain personal data for as long as necessary to provide the Service and for legitimate business needs (account maintenance, fraud prevention, legal compliance). When you delete your account, we remove or anonymise your data within a reasonable timeframe, except where retention is required by law.

## 8. Children

The Service is not intended for children under 13 (or the higher minimum age required in your country). We do not knowingly collect information from children. If you believe a child has provided us information, contact us and we will delete it.

## 9. International transfers

We operate in more than one country, so your data may be transferred to and processed in countries other than your own. We take contractual and legal steps to protect your data during transfers (for example, Standard Contractual Clauses where applicable).

## 10. Partners & public content

When you become a partner, we may showcase your business, logo, photos, and videos for promotional purposes, and will obtain your consent for the use of your branded assets where required. Content submitted by members at partner locations may be shared publicly, and partners may use that content for their own marketing (subject to the licence and attributions noted at signup).

## 11. Changes to this policy

We may update this policy from time to time. We will post the updated policy with a new effective date and, where required, notify users by email or in-app notice. Continued use of the Service after a change means you accept the updated policy.

## 12. Contact us

For questions about this policy, or to exercise your rights:

- **Email:** enquiry@wegood4u.com
- **Company:** Say Sheji Group Sdn Bhd`,
};

export const TERMS: LegalDoc = {
  title: "Terms of Service",
  updated: "25 July 2026",
  intro:
    "These Terms govern your use of the Wegood4u app and website (the “Service”), operated by Say Sheji Group Sdn Bhd (“Wegood4u”, “we”, “us”). By using the Service you agree to these Terms. Please read them alongside our Privacy Policy.",
  body: `## 1. Acceptance of these Terms

By downloading, accessing, or using the Service, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, please do not use the Service.

## 2. Eligibility

You must be at least 13 years old (or the higher minimum age required in your country) to use the Service, and you must be able to form a binding contract. If you use the Service on behalf of a business, you confirm you are authorised to accept these Terms for that business.

## 3. Your account

- You are responsible for the accuracy of the information you provide and for keeping your login credentials secure.
- You are responsible for activity that happens under your account.
- Tell us promptly at enquiry@wegood4u.com if you believe your account has been compromised.

## 4. Membership, visits & rewards

- Wegood4u lets members visit partner venues, submit proof of a visit (such as a selfie and a receipt or venue photo), and earn credits toward rewards.
- Every submission is subject to verification. We may decline or reverse credits for submissions that cannot be verified, appear fraudulent, or breach these Terms.
- Rewards, credits, tiers, and referral bonuses have no cash value, are non-transferable except as we allow, and may change or be withdrawn. Availability of any specific reward is not guaranteed.
- We may set and adjust the rules of the programme (including how credits, tiers, and referrals work) to keep it fair and prevent abuse.

## 5. Acceptable use

You agree not to:

- Submit false, misleading, or fraudulent visits, content, or referrals.
- Use bots, automation, or multiple accounts to game rewards.
- Upload content that is unlawful, infringing, abusive, or that you do not have the right to share.
- Interfere with, disrupt, or attempt to gain unauthorised access to the Service or its systems.
- Misuse partner venues or misrepresent your affiliation with Wegood4u.

We may suspend or remove content or accounts that breach this section.

## 6. Your content & licence

You keep ownership of the content you submit. By submitting content, you grant Wegood4u a worldwide, non-exclusive, royalty-free licence to host, store, reproduce, adapt, publish, and display that content to operate and promote the Service and its partners, in line with our Privacy Policy. Do not submit content you are not willing to have shared publicly.

## 7. Partners

Partner listings, offers, and rewards are provided by or in cooperation with third-party venues. We are not responsible for the products, services, or conduct of any partner. Your dealings with a partner are between you and that partner.

## 8. Intellectual property

The Service, including its software, design, logos, and branding, is owned by Wegood4u or its licensors and is protected by intellectual-property laws. We grant you a limited, personal, non-transferable licence to use the Service for its intended purpose. You may not copy, modify, or create derivative works from the Service except as permitted by law.

## 9. Third-party links & services

The Service may link to third-party sites or use third-party services (for example, app stores, maps, or payment processors). We are not responsible for third-party content or practices, which are governed by their own terms.

## 10. Disclaimers

The Service is provided on an “as is” and “as available” basis. To the extent permitted by law, we disclaim all warranties, express or implied, including fitness for a particular purpose and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or secure.

## 11. Limitation of liability

To the maximum extent permitted by law, Wegood4u will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill, arising from your use of the Service. Our total liability for any claim relating to the Service is limited to the amount you paid us (if any) in the 12 months before the claim.

## 12. Indemnity

You agree to indemnify and hold Wegood4u harmless from claims and expenses arising out of your misuse of the Service, your content, or your breach of these Terms.

## 13. Suspension & termination

We may suspend or terminate your access to the Service if you breach these Terms or use the Service in a way that harms Wegood4u, its members, or its partners. You may stop using the Service and delete your account at any time.

## 14. Governing law

These Terms are governed by the laws of Malaysia, and you agree to the exclusive jurisdiction of the courts of Malaysia, without regard to conflict-of-laws principles.

## 15. Changes to these Terms

We may update these Terms from time to time. We will post the updated Terms with a new effective date and, where required, notify you. Continued use of the Service after a change means you accept the updated Terms.

## 16. Contact us

Questions about these Terms? Email enquiry@wegood4u.com — Say Sheji Group Sdn Bhd.`,
};
