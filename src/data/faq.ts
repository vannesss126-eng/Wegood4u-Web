/**
 * FAQ content — one source for the /how-it-works teaser, the future /faq page
 * (Phase 6) and their FAQPage JSON-LD. Kept in `data/` so those consumers can
 * never drift, and so the schema only ever contains Q&As that are really on a
 * page (an FAQPage that lists unseen questions is a structured-data violation).
 *
 * Verbatim from `wp-archive/faq.html`, with ONE deliberate correction: the WP
 * answer to "How do I become a member?" said "sign up on our website". After
 * the app-first pivot the marketing site collects no credentials (R10) —
 * registration happens in the app — so keeping the WP wording would be a false
 * claim about how the product works. Rewritten to the app signup. Every other
 * answer is the client's own copy.
 *
 * Bilingual: each item carries a machine-drafted Thai translation (`qTh`/`aTh`)
 * flagged for later native review. The English `q`/`a` remain the canonical
 * copy and are the ONLY versions used in the FAQPage JSON-LD schema (a schema
 * must mirror what a default-locale crawler sees). Rendered components localize
 * the DISPLAYED copy via `localizeFaqs()`; brand/proper nouns, prices (RM…),
 * package names (Starter/Growth/Premium), tier names (Bronze…Diamond) and city
 * names stay in Roman script.
 */

export type FaqItem = {
  q: string;
  a: string;
  qTh: string;
  aTh: string;
};

/**
 * Return the FAQ items with their displayed copy swapped to Thai when
 * `locale === "th"`; otherwise the items are returned unchanged. The object
 * shape stays `FaqItem` (the Thai fields ride along), so callers keep mapping
 * over `q`/`a` exactly as before.
 */
export function localizeFaqs(items: FaqItem[], locale: string): FaqItem[] {
  if (locale !== "th") return items;
  return items.map((item) => ({ ...item, q: item.qTh, a: item.aTh }));
}

export const MEMBER_FAQS: FaqItem[] = [
  {
    q: "What is Wegood4u and how does it work?",
    a: "Wegood4u is a membership platform that connects food and travel enthusiasts with F&B and tourism businesses across Southeast Asia. Members visit listed venues, create content like selfies and short reviews, and earn rewards based on their visits and contributions.",
    qTh: "Wegood4u คืออะไร และทำงานอย่างไร?",
    aTh: "Wegood4u เป็นแพลตฟอร์มสมาชิกที่เชื่อมโยงผู้ที่ชื่นชอบอาหารและการท่องเที่ยวเข้ากับธุรกิจร้านอาหารและการท่องเที่ยวทั่วเอเชียตะวันออกเฉียงใต้ สมาชิกไปร้านที่ร่วมรายการ สร้างคอนเทนต์อย่างเซลฟี่และรีวิวสั้นๆ และรับรางวัลตามการไปร้านและการมีส่วนร่วมของตน",
  },
  {
    q: "How do I become a member?",
    a: "Download the Wegood4u app, sign up, and complete a quick verification. Once you’re verified, set your preferences and start exploring partner venues and earning points for each visit.",
    qTh: "จะสมัครเป็นสมาชิกได้อย่างไร?",
    aTh: "ดาวน์โหลดแอป Wegood4u สมัครสมาชิก และทำการยืนยันตัวตนอย่างรวดเร็ว เมื่อยืนยันแล้ว ตั้งค่าความชอบของคุณ แล้วเริ่มสำรวจร้านพันธมิตรและสะสมคะแนนในทุกการไปร้าน",
  },
  {
    q: "What kind of rewards can I earn?",
    a: "Members earn points for every valid visit and submission. After your 10th visit, you’ll receive exclusive rewards like dining vouchers, travel gifts, and special experiences from our partners.",
    qTh: "คุณจะรับรางวัลแบบไหนได้บ้าง?",
    aTh: "สมาชิกจะสะสมคะแนนจากทุกการไปร้านและการส่งข้อมูลที่ถูกต้อง หลังจากการไปร้านครั้งที่ 10 คุณจะได้รับรางวัลสุดพิเศษ เช่น บัตรกำนัลร้านอาหาร ของขวัญสำหรับการท่องเที่ยว และประสบการณ์พิเศษจากพันธมิตรของเรา",
  },
  {
    q: "How do I submit proof of my visit?",
    a: "After visiting a partner venue, upload a selfie with the place and a photo of the restaurant or attraction through the app. Our team reviews and approves your submission before awarding points.",
    qTh: "จะส่งหลักฐานการไปร้านได้อย่างไร?",
    aTh: "หลังจากไปร้านพันธมิตร ให้อัปโหลดเซลฟี่คู่กับสถานที่และรูปถ่ายของร้านอาหารหรือสถานที่ท่องเที่ยวผ่านแอป ทีมงานของเราจะตรวจสอบและอนุมัติข้อมูลที่คุณส่งก่อนมอบคะแนน",
  },
  {
    q: "Can I join from any country?",
    a: "Yes — Wegood4u is open to international members. Many partner venues are currently in Southeast Asia, and we’re expanding to new regions.",
    qTh: "คุณสมัครจากประเทศใดก็ได้ไหม?",
    aTh: "ได้ — Wegood4u เปิดรับสมาชิกจากทั่วโลก ปัจจุบันร้านพันธมิตรหลายแห่งอยู่ในเอเชียตะวันออกเฉียงใต้ และเรากำลังขยายไปยังภูมิภาคใหม่ๆ",
  },
];

/** The teaser on /how-it-works shows the first four; the fifth lives on /faq. */
export const MEMBER_FAQS_TEASER = MEMBER_FAQS.slice(0, 4);

/**
 * Partner-facing FAQ — shown on /partnership and mirrored into that page's
 * FAQPage JSON-LD. Content from the F&B partnership landing page
 * (wegood4u.saysheji.my/fnb-partnership), kept in the platform's own terms
 * (unique-store rule, per-verified-visit pricing, no lock-in).
 */
export const PARTNER_FAQS: FaqItem[] = [
  {
    q: "How much does it cost to join?",
    a: "There's a one-time content-production fee based on your package (Starter, Growth or Premium), then a small fee per verified visit — you only pay when a real, verified customer dines with you. No monthly subscription and no long-term contract.",
    qTh: "การเข้าร่วมมีค่าใช้จ่ายเท่าไร?",
    aTh: "มีค่าผลิตคอนเทนต์แบบครั้งเดียวตามแพ็กเกจของคุณ (Starter, Growth หรือ Premium) จากนั้นเป็นค่าธรรมเนียมเล็กน้อยต่อการไปร้านที่ยืนยันแล้ว — คุณจ่ายเฉพาะเมื่อมีลูกค้าจริงที่ยืนยันแล้วมารับประทานอาหารที่ร้านของคุณ ไม่มีค่าสมาชิกรายเดือนและไม่มีสัญญาผูกมัดระยะยาว",
  },
  {
    q: "How do you verify that customers actually visited?",
    a: "Every visit is confirmed with AI-powered selfie + receipt verification. There are no bots and no fake reviews — you only pay for genuine, verified diners who actually ate at your restaurant.",
    qTh: "คุณยืนยันได้อย่างไรว่าลูกค้ามาที่ร้านจริง?",
    aTh: "ทุกการไปร้านได้รับการยืนยันด้วยการตรวจสอบเซลฟี่และใบเสร็จที่ขับเคลื่อนด้วย AI ไม่มีบอทและไม่มีรีวิวปลอม — คุณจ่ายเฉพาะนักชิมจริงที่ยืนยันแล้วซึ่งมารับประทานอาหารที่ร้านของคุณจริงๆ",
  },
  {
    q: "What if I don't get enough customers?",
    a: "The model is performance-based: the per-visit fee is only charged on verified visits, so you're never paying for customers who didn't come. Our partnership team also reviews your performance monthly and helps optimise your listing and content.",
    qTh: "ถ้าลูกค้ามาไม่มากพอจะเป็นอย่างไร?",
    aTh: "โมเดลนี้อิงตามผลลัพธ์: ค่าธรรมเนียมต่อการไปร้านจะเก็บเฉพาะการไปร้านที่ยืนยันแล้ว ดังนั้นคุณจะไม่ต้องจ่ายสำหรับลูกค้าที่ไม่ได้มา ทีมพันธมิตรของเรายังตรวจสอบผลงานของคุณทุกเดือนและช่วยปรับปรุงรายการและคอนเทนต์ของคุณให้ดียิ่งขึ้น",
  },
  {
    q: "What makes this different from hiring KOLs or running ads?",
    a: "KOLs and ads can't guarantee a paying customer walks through your door, and neither is verified. Every Wegood4u member must complete at least 6 real restaurant visits per cycle (referral credits are capped at 4 of 10), so the people visiting you are genuinely active diners — and every visit is tracked in your dashboard.",
    qTh: "สิ่งนี้ต่างจากการจ้าง KOL หรือการลงโฆษณาอย่างไร?",
    aTh: "KOL และโฆษณาไม่สามารถรับประกันได้ว่าจะมีลูกค้าที่จ่ายเงินเดินเข้าร้านของคุณ และทั้งสองอย่างก็ไม่ได้รับการยืนยัน สมาชิก Wegood4u ทุกคนต้องไปร้านอาหารจริงอย่างน้อย 6 ครั้งต่อรอบ (เครดิตแนะนำจำกัดที่ 4 จาก 10) ดังนั้นคนที่มาที่ร้านของคุณคือนักชิมที่แอ็กทีฟจริงๆ — และทุกการไปร้านถูกบันทึกไว้ในแดชบอร์ดของคุณ",
  },
  {
    q: "Is there a contract or lock-in period?",
    a: "No. There are no long-term contracts and no lock-in — you can leave any time. You pay the one-time content fee up front and then only the per-visit fee as verified customers arrive.",
    qTh: "มีสัญญาหรือระยะเวลาผูกมัดไหม?",
    aTh: "ไม่มี ไม่มีสัญญาระยะยาวและไม่มีการผูกมัด — คุณสามารถออกได้ทุกเมื่อ คุณจ่ายค่าคอนเทนต์แบบครั้งเดียวล่วงหน้า จากนั้นจ่ายเพียงค่าธรรมเนียมต่อการไปร้านเมื่อมีลูกค้าที่ยืนยันแล้วมาถึง",
  },
  {
    q: "How long before I start seeing results?",
    a: "Once you apply, our team reviews your restaurant within 48 hours and schedules a shoot. Your listing typically goes live within 7 days of the content-production day, and verified customers begin arriving as part of members' visit cycles from there.",
    qTh: "ต้องใช้เวลานานเท่าไรก่อนจะเริ่มเห็นผล?",
    aTh: "เมื่อคุณสมัคร ทีมงานของเราจะตรวจสอบร้านอาหารของคุณภายใน 48 ชั่วโมงและนัดวันถ่ายทำ โดยทั่วไปรายการของคุณจะเผยแพร่ภายใน 7 วันหลังจากวันผลิตคอนเทนต์ และลูกค้าที่ยืนยันแล้วจะเริ่มมาถึงตามรอบการไปร้านของสมาชิกจากนั้น",
  },
  {
    q: "What content do I get, and can I reuse it?",
    a: "Every package includes professional 4K video (with drone footage and an on-camera host on the higher tiers), distributed across TikTok, Instagram, Facebook and YouTube. Raw footage is delivered on eligible packages, so you can reuse it for your own marketing.",
    qTh: "ฉันจะได้คอนเทนต์อะไรบ้าง และนำกลับมาใช้ซ้ำได้ไหม?",
    aTh: "ทุกแพ็กเกจรวมวิดีโอ 4K ระดับมืออาชีพ (พร้อมภาพจากโดรนและพิธีกรหน้ากล้องในแพ็กเกจระดับสูง) เผยแพร่บน TikTok, Instagram, Facebook และ YouTube ฟุตเทจดิบจะส่งมอบในแพ็กเกจที่มีสิทธิ์ ดังนั้นคุณสามารถนำกลับมาใช้ซ้ำสำหรับการตลาดของคุณเองได้",
  },
  {
    q: "Which markets are you available in?",
    a: "Wegood4u is live in Klang Valley (Malaysia) and Chiang Mai (Thailand), with more markets on the way. Package pricing shown is for Malaysia — reach out for pricing in Chiang Mai and other regions.",
    qTh: "คุณให้บริการในตลาดใดบ้าง?",
    aTh: "Wegood4u เปิดให้บริการแล้วใน Klang Valley (มาเลเซีย) และ Chiang Mai (ประเทศไทย) พร้อมตลาดใหม่ๆ ที่กำลังจะมา ราคาแพ็กเกจที่แสดงเป็นราคาสำหรับมาเลเซีย — ติดต่อเราเพื่อสอบถามราคาสำหรับ Chiang Mai และภูมิภาคอื่นๆ",
  },
];

/**
 * Membership-programme FAQ — the member-facing questions from the new-member
 * landing page (wegood4u.saysheji.my/new-member). Shown on /membership and
 * mirrored into that page's FAQPage JSON-LD. Explains the 10-credit task cycle,
 * AI verification, rewards and the multi-tier referral system in plain terms.
 */
export const MEMBERSHIP_PROGRAM_FAQS: FaqItem[] = [
  {
    q: "Is Wegood4u really free to join?",
    a: "Yes — joining is completely free, with no credit card and no subscription. You download the app, sign up, and start earning from day one. The only thing you spend is what you'd already spend eating out.",
    qTh: "Wegood4u สมัครฟรีจริงหรือ?",
    aTh: "ใช่ — การสมัครฟรีอย่างสมบูรณ์ ไม่ต้องใช้บัตรเครดิตและไม่มีค่าสมาชิก คุณดาวน์โหลดแอป สมัครสมาชิก และเริ่มรับรางวัลได้ตั้งแต่วันแรก สิ่งเดียวที่คุณจ่ายคือเงินที่คุณจะใช้ทานอาหารนอกบ้านอยู่แล้ว",
  },
  {
    q: "What does “10 credits per task” mean?",
    a: "Every reward is one completed task, and a task is 10 credits. You earn most of them by visiting partner restaurants yourself — at least 6 real visits — and you can top up the rest with referral credits, which are capped at 4 of the 10. Once you reach 10, the task completes and resets, and you can claim your reward.",
    qTh: "“10 เครดิตต่อภารกิจ” หมายความว่าอย่างไร?",
    aTh: "ทุกรางวัลคือหนึ่งภารกิจที่ทำสำเร็จ และหนึ่งภารกิจคือ 10 เครดิต คุณจะได้เครดิตส่วนใหญ่จากการไปร้านอาหารพันธมิตรด้วยตัวเอง — อย่างน้อย 6 ครั้งจริง — และเติมส่วนที่เหลือด้วยเครดิตแนะนำซึ่งจำกัดที่ 4 จาก 10 เมื่อคุณครบ 10 ภารกิจจะสำเร็จและรีเซ็ต และคุณสามารถรับรางวัลได้",
  },
  {
    q: "How does the AI verification work?",
    a: "At a partner restaurant you snap a selfie and your receipt in the app. Our AI checks them against the venue in seconds, confirming you were really there. No manual review queue, no waiting — a verified visit is added to your task straight away.",
    qTh: "การยืนยันด้วย AI ทำงานอย่างไร?",
    aTh: "ที่ร้านอาหารพันธมิตร คุณถ่ายเซลฟี่และใบเสร็จของคุณในแอป AI ของเราจะตรวจสอบกับสถานที่ภายในไม่กี่วินาที เพื่อยืนยันว่าคุณอยู่ที่นั่นจริง ไม่มีคิวตรวจสอบด้วยมือ ไม่ต้องรอ — การไปร้านที่ยืนยันแล้วจะถูกเพิ่มเข้าภารกิจของคุณทันที",
  },
  {
    q: "How do I claim my reward?",
    a: "When your task hits 10 credits, a free stay unlocks in the app. You browse the available hotels, resorts and homestays for your tier, pick one, and redeem it — the booking is handled through Wegood4u. Each completed task is a stay worth roughly RM 300–800.",
    qTh: "จะรับรางวัลได้อย่างไร?",
    aTh: "เมื่อภารกิจของคุณครบ 10 เครดิต ที่พักฟรีจะปลดล็อกในแอป คุณสามารถเลือกดูโรงแรม รีสอร์ต และโฮมสเตย์ที่มีให้สำหรับระดับของคุณ เลือกหนึ่งแห่ง และแลกรับ — การจองดำเนินการผ่าน Wegood4u ทุกภารกิจที่ทำสำเร็จคือที่พักมูลค่าประมาณ RM 300–800",
  },
  {
    q: "What types of accommodation can I get?",
    a: "Rewards range from 3–4★ hotels and resort getaways to curated homestays, typically worth RM 300–800 a stay. The quality of the accommodation you can book improves as you climb the tiers, from Bronze up to Diamond.",
    qTh: "คุณจะได้ที่พักประเภทใดบ้าง?",
    aTh: "รางวัลมีตั้งแต่โรงแรมระดับ 3–4★ และการพักผ่อนที่รีสอร์ต ไปจนถึงโฮมสเตย์ที่คัดสรร โดยทั่วไปมูลค่าประมาณ RM 300–800 ต่อการเข้าพัก คุณภาพของที่พักที่คุณจองได้จะดีขึ้นเมื่อคุณไต่ระดับขึ้นไป จาก Bronze จนถึง Diamond",
  },
  {
    q: "Can I use Wegood4u in multiple countries?",
    a: "Yes. Wegood4u is live in Malaysia (Klang Valley) and Thailand (Chiang Mai), and your account works across both. More cities are on the way, so visits and rewards travel with you as we expand.",
    qTh: "ใช้ Wegood4u ได้ในหลายประเทศไหม?",
    aTh: "ได้ Wegood4u เปิดให้บริการแล้วในมาเลเซีย (Klang Valley) และประเทศไทย (Chiang Mai) และบัญชีของคุณใช้ได้ในทั้งสองที่ เมืองใหม่ๆ กำลังจะมา ดังนั้นการไปร้านและรางวัลจะติดตามคุณไปเมื่อเราขยายบริการ",
  },
  {
    q: "How long does it take to earn a free stay?",
    a: "It depends on how often you dine out. Since you're visiting places you'd eat at anyway, most active members complete a task in a few weeks — and referring friends helps you close the last few credits faster.",
    qTh: "ต้องใช้เวลานานเท่าไรในการรับที่พักฟรี?",
    aTh: "ขึ้นอยู่กับว่าคุณทานอาหารนอกบ้านบ่อยแค่ไหน เนื่องจากคุณไปร้านที่คุณจะทานอยู่แล้ว สมาชิกที่แอ็กทีฟส่วนใหญ่ทำภารกิจสำเร็จภายในไม่กี่สัปดาห์ — และการแนะนำเพื่อนช่วยให้คุณเก็บเครดิตสองสามอันสุดท้ายได้เร็วขึ้น",
  },
  {
    q: "How does the referral system work?",
    a: "Invite friends and you earn credits when they dine: a direct referral earns you a full credit, a friend-of-a-friend earns a partial credit, and their wider network earns a little more, up to a monthly cap. Referral credits count toward a task up to a maximum of 4 of 10, so real visits always stay the heart of it.",
    qTh: "ระบบแนะนำเพื่อนทำงานอย่างไร?",
    aTh: "ชวนเพื่อนแล้วคุณจะได้เครดิตเมื่อพวกเขาทานอาหาร: การแนะนำโดยตรงให้คุณได้หนึ่งเครดิตเต็ม เพื่อนของเพื่อนให้เครดิตบางส่วน และเครือข่ายที่กว้างขึ้นของพวกเขาให้เพิ่มอีกเล็กน้อย สูงสุดตามขีดจำกัดรายเดือน เครดิตแนะนำนับรวมในภารกิจได้สูงสุด 4 จาก 10 ดังนั้นการไปร้านจริงยังคงเป็นหัวใจสำคัญเสมอ",
  },
  {
    q: "What happens if my visit isn't verified?",
    a: "If a selfie or receipt can't be matched — a blurry photo, or the wrong venue — the visit simply isn't counted, and you'll see why in the app. Nothing is deducted; just re-submit a clear selfie and receipt from the partner restaurant and it'll verify.",
    qTh: "จะเกิดอะไรขึ้นถ้าการไปร้านของฉันไม่ได้รับการยืนยัน?",
    aTh: "หากเซลฟี่หรือใบเสร็จไม่สามารถจับคู่ได้ — รูปเบลอ หรือผิดสถานที่ — การไปร้านนั้นจะไม่ถูกนับ และคุณจะเห็นเหตุผลในแอป ไม่มีการหักอะไร เพียงส่งเซลฟี่และใบเสร็จที่ชัดเจนจากร้านอาหารพันธมิตรอีกครั้ง แล้วระบบจะยืนยัน",
  },
];
