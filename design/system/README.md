Panny is a test kitchen for your health goal: the warmth of a mid-century cookbook, the evidence of today. It's peppy, confident and ready to cook, on screens that are insanely simple. Every rule below serves one of those things.

The look borrows the era's print language (cream paper, cherry and navy ink, starbursts, recipe cards, flat food illustration). The voice and the claims stay modern. Never copy a real brand's label, logo, mascot or trade dress.

## Simplicity rules

- One question or decision per screen.
- One primary button per screen, set in `cherry`.
- No more than three content blocks before the first scroll.
- One period motif per screen: a starburst, a recipe card, a halftone corner or an illustration. Never all of them.
- Cut words before adding layout. If a line doesn't help someone cook tonight, it goes.

## Voice

- Short, upbeat, second person: "Let's cook," "You have 6 of 10," "Pick one. You can change it anytime."
- Contractions always. Sentence case for everything except the wordmark and `eyebrow` labels.
- Retro look, modern voice: cheerful, never quaint. No "housewife," "the little lady," "hubby" or cooking-as-duty framing. Cooking is for anyone.
- Celebrate cooking, never restriction. No diet-culture words: "guilt-free," "clean," "cheat," "detox," "burn."
- Health language follows Panny's claim rules: "supports heart-healthy eating," never "lowers" or "treats." Mid-century ads made loose health promises; Panny never does. Goal fit is always Panny's own, personal assessment, and it restates the user's goal ("Supports healthy LDL," "Some LDL support"), never a generic "Fits your goal" and never the creator's claim.
- Credit creators everywhere their work appears: "Recipe by [Creator Name]" or "By @handle."
- No emoji.

## Color

- `paper` is the ground on every screen. `white` is for cards, index cards and secondary buttons on top of it.
- `cherry` is the brand. Use it for the primary button, the script accent and recipe-card top bands. Text on cherry is always white. Never a large background.
- `mustard` is the highlight: starbursts, the strong goal tag, progress fills. `mint` is the quiet accent: illustration backdrops, filter tags, the vote panel.
- `navy` is the only text and outline color. `navy-muted` is for meta lines and helper text, on paper, white and parchment only.
- `parchment` is for placeholders and the highlight behind amounts in steps.
- Selected chips and options invert: `navy` fill with `on-navy` text.
- Allergen and medication warnings use a `cherry` fill with white text and an alert mark.

## Type

- Headlines use the `display` family, Fraunces Black: `display-xl` for one hero line, `display-l` for the screen's single question, `title` for cards and sections.
- The `script` family, Yellowtail, is a garnish: one cherry phrase of two or three words per screen at most ("Hello, dinner!", "Nice cooking!"), or one word in a starburst ("Quick!"). Never for instructions, buttons or anything the user must read to act.
- Everything else uses the `sans` family, DM Sans: `body-l` for lead lines and steps, `body` by default, `label` on buttons, `chip` on chips and badges, `caption` for meta, `eyebrow` for uppercase card labels.
- One display style per screen. Never set body copy in the display or script face.

## Shape and depth

- Interactive things are fat and outlined: a `stroke-ink` (2px) `navy` border plus a hard, offset `shadow-press` drop, down and to the right. On press the drop shrinks to 2px and the control moves 2px, so it looks pushed in.
- Buttons, option buttons and inputs use `radius-lg` (softened rectangles, like a vintage appliance button). Chips, tags and goal badges are pills. Cards use `radius-md` with `shadow-card`; recipe index cards use `radius-sm`.
- No blurred shadows, gradients or glassy effects. Halftone dots are the only texture.
- Minimum touch target 44px. Primary buttons and option buttons are 56px tall; chips in a group are 48px. Every control in one group shares one height, selected or not.

## Motifs

- **Starburst:** a 24-point `mustard` star with a `navy` outline, for the welcome screen, onboarding and marketing only ("One pan!", "Quick!"). Never on recipe, Why or health-education screens: there the goal shows as the `mustard` pill. Never more than one per screen.
- **Recipe index card:** `white`, `radius-sm`, a 10px `cherry` top band, `rule-blue` ruled lines, `eyebrow` label ("RECIPE FOR · MONDAY"). On the recipe page it is a two-sided card: ingredients on the front, steps on the back, turned with a "Flip for the steps" control. Ingredient rows are 52px with a rule under each; step lines rule every 28px. Respect reduced motion: with `prefers-reduced-motion`, swap sides with a crossfade instead of a turn.
- **Ruling is always uniform:** one 1px `rule-blue` line every 28px, from the card's header to its footer, with no gaps, double lines or thicker dividers. Every row on a card snaps to the grid: text at a 28px line height, ingredient rows at 56px, the footer at 56px. Never stack a second ruled background inside a card; use one continuous sheet.
- **Halftone:** `cherry` dots at 10px pitch, 15–25% opacity, cropped into one corner of a hero or welcome screen.
- **Illustration:** flat food spots (bowls, pans, produce) in `cherry`, `mustard` and `mint` with `navy` line work, set on a `mint` circle. Real dish photos and creator video still win wherever they exist.

## Nutrition

- Recipe cards show three per-serving stats in a row: fiber, protein, saturated fat. Value in `display` 19px, label in `caption`, on `paper` tiles.
- The recipe page shows four: fiber (with the soluble share when known), protein, saturated fat and sodium, each with its % Daily Value and a `mustard` bar on `parchment`.
- Values come from the recipe's own amounts and USDA data, per serving, and the screen says so. No calories by default; no grades or scores on numbers.

## Health education

- Teach how foods work, at the depth of a good science explainer, in a block titled "How it works, in plain English."
- Each item: a `mint` icon disc, a bold lead naming the food and the nutrient ("White beans: soluble fiber that forms a gel."), then two or three sentences on the mechanism, then a numbered footnote to a source.
- Quote authorized claim wording verbatim in a "The official word" box. Recipe-level fit stays "supports"; mechanism sentences describe how a nutrient works, never what this dinner will do to a lab result.
- Every education screen ends with "Education, not medical advice" and the clinician note.
- The goal's foods screen is titled in plain language: "Foods for healthy LDL," never "power foods" or "superfoods."
- Every food shows its evidence tier as a pill: a `navy` letter disc plus a label. A "FDA-authorized claim" on `mint` (green), B "Strong research" on `mustard` (yellow), C "Early research" on `white`. A tier legend sits at the top of the screen with a "How we grade evidence" link. Tiers come only from the evidence rubric, never from copy.
- Foods are an accordion: one line per food (icon, name, tier); tapping opens How it works, the source, and "Not a fan? Try …", which swaps to a genuinely different food and can be switched back. No copy that makes a swap feel like failure.
- Foods use icons, not photos, until photography standards are in place.

## Layout

- Mobile first: `space-6` screen padding, `space-4` card padding, `space-3` between options and buttons.
- Desktop: `space-14` page padding and `space-9` between blocks, with a single readable column for recipe content.

## Recipe content

- Steps always name each ingredient with its amount, scaled to the servings the user picked: "Warm 2 tbsp olive oil," never "Warm the oil." Amounts in steps are bold on a `parchment` highlight so they scan while cooking.
- The amounts in steps and the ingredient list come from one source, so they can never disagree.
- There is one way into cooking mode: the sticky "Start cooking" button. Don't repeat it inside the recipe card.
- Cooking mode shows one step at a time at 26px with the same amounts, keeps the screen awake and offers a timer when a step has a time.
- There is one shopping list per week and it is the single source of truth. Recipes never have their own "Add to list"; the ingredient card says "On this week's list" and links to it. Swaps, moves and skips update the list, and the list header says so.
- Servings use a stepper ("– Serves 4 +") whose default is the household number from setup; setup offers 1, 2, 4 and 6 so the two always agree.
- Show that recipes are tested: "Cooked in the Panny test kitchen" on recipes the kitchen has made.

## Goal and filter tags

- Every dinner in a plan meets one LDL-friendly bar, so a recipe card carries one goal tag, bottom left of the photo: `navy` fill, `on-navy` text, check, "LDL-friendly." It is navy, not mustard, so it never reads as a B evidence tier. There is no partial level.
- Familiar dinners add a `white` "Family favorite" pill, and the card body shows a `mint` note, "Made LDL-friendly: …", naming each change (half lean turkey, half lentils; whole-wheat pasta).
- Future filters (crowds, families, kids) sit beside it as `mint` pills in weight 500 ("Kid-friendly"). Show the goal tag plus at most one filter, then "+N."
- Tags state fit only. They never state a health outcome.
- Keep the goal and the tag apart. The goal is the user's choice, shown as text ("Your goal · Healthy LDL cholesterol"), never as a pill. The tag is the dinner's fit, always the exact goal tag ("LDL-friendly"), with no variants like "LDL-friendly for your goal." Both come from one goal config so screens and data agree.

## Changing the week

- Every dinner card ends with three equal pills: Swap, Move, Skip. The card itself opens the recipe.
- **Swap** opens a bottom sheet: the night and the dinner being replaced, optional reason chips ("Not feeling it," "Too long tonight," "Someone won't eat it," "Had it recently"), then three replacements that meet every constraint, each with time, fiber, protein and tags. "Too long tonight" sorts fastest first. If the dinner is the week's last Family favorite, familiar replacements come first.
- **Move** lists the other nights: "Free night," or "Trade nights with …" when one is taken. The list doesn't change.
- **Skip** offers "Take its ingredients off my list" (default) or "Save it for next week," then a cherry "Skip Thursday." A skipped night collapses to a dashed card with Undo and "Add a dinner."
- Every change confirms in a `navy` toast that says what happened to the list, with Undo.

## Household

- Setup asks "Who's at the table?" once: who you cook for, what to plan around (a picky eater, someone wants meat most nights), and foods someone won't touch.
- Every week includes at least one familiar dinner. Healthy-LDL copy talks about less saturated fat and more fiber, never about giving up meat.
- Check-ins ask "Did everyone eat it?" and "Make it again?", not "How was it?"

## Imagery and creator video

- Real food and real creator video first. Illustration is for onboarding, empty states and placeholders, never in place of a creator's dish.
- On the recipe page the creator video starts small: one tap target with a 66×116 vertical thumbnail (play button, duration), "Recipe by [Creator Name]," the handle and "Watch the video here." It plays the platform's player in an overlay inside Panny; nothing loads before the tap. The link out to the original post lives in the credit section at the bottom, not next to the video, so the main path keeps people in the recipe.
- Card photos follow the photo standards: a finished dish, at least 1080px wide, no text overlays, cropped to the 4:3 safe area, with a `navy` scrim at the bottom so tags stay readable on any photo.
- Until a video loads, show a `parchment` placeholder with the dish name, not the creator's thumbnail.

## Iconography

- Links that leave Panny (to Instagram, YouTube or a creator's site) carry a trailing external-link icon and say where they go: "Open in Instagram."
- No icon set has been chosen yet. Use simple 2px-stroke line icons in `navy` at 20–24px, matching the outline weight. Flagged: pick and import a real icon set before the build.
- Icon-only buttons always carry an accessible label.

## Logo

- No logo exists yet. Set the name as a wordmark, lowercase "panny," in the `display` family at weight 700, `navy` on `paper`.

## Accessibility

- Text pairs: `navy` on `paper`, `white`, `parchment`, `mustard` and `mint`; `navy-muted` on `paper`, `white` and `parchment`; white on `cherry`; `on-navy` on `navy`. All pass 4.5:1. Never `navy` on `cherry` (2.5:1).
- Script text is decorative emphasis only; the same meaning is always in plain text nearby.
- Focus ring: a solid 3px `navy` outline offset by 2px on every surface.
- Selection is never shown by color alone: selected options and chips also invert to `navy` and carry `aria-pressed`.
