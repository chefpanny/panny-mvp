// "Why this dinner fits" content. The skillet's copy is verbatim from V2-8B-Why.
// Other recipes are assembled from the food library's own "How it works" copy (no new claims).
import type { IconKey, Tier } from './foods';

export type WhyItem = { tier: Tier; icon: IconKey; lead: string; body: string; source: number };
export type WhyContent = { intro: string; items: WhyItem[]; officialSource: number | null; pairing?: { lead: string; body: string; source: number }; sources: string[] };

export const OFFICIAL_WORD_101_77 =
  '"Diets low in saturated fat and cholesterol and rich in fruits, vegetables and grain products that contain some types of dietary fiber, particularly soluble fiber, may reduce the risk of heart disease, a disease associated with many factors."';

export const WHY_OVERRIDES: Record<string, WhyContent> = {
  'white-bean-kale-skillet': {
    intro: 'Two LDL foods doing real work, and very little saturated fat. Every dinner in your week meets the same LDL-friendly bar.',
    items: [
      { tier: 'A', icon: 'bean', lead: 'White beans: soluble fiber that forms a gel.', body: 'In your gut, the gel traps bile acids, which your liver makes from cholesterol. Those bile acids leave your body instead of being recycled, so your liver pulls LDL cholesterol from your blood to make more.', source: 1 },
      { tier: 'A', icon: 'grain', lead: 'Kale and whole-grain bread: more fiber.', body: 'Fiber from vegetables and whole grains adds up across the week, and whole grains take the place of refined bread.', source: 1 },
      { tier: 'B', icon: 'drop', lead: 'Olive oil instead of butter: less saturated fat.', body: "Saturated fat is the fat most tied to higher LDL. Olive oil's fats are mostly unsaturated, so this dinner stays at about 3 g per serving.", source: 2 },
    ],
    officialSource: 1,
    pairing: { lead: 'Lemon + beans and kale.', body: "Lemon juice adds vitamin C, which helps your body absorb the plant iron in beans and kale.", source: 3 },
    sources: [
      'FDA authorized health claim: fiber-containing grain products, fruits and vegetables and risk of coronary heart disease (21 CFR 101.77)',
      'Dietary Guidelines for Americans: saturated fat',
      'NIH Office of Dietary Supplements, Iron fact sheet for health professionals',
    ],
  },
};
