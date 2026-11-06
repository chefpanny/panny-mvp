Tells the user, privately, how a recipe fits their own goal. It always restates the goal.

- **Goal tag, pill:** `navy` fill, `on-navy` text, with a check (never `mustard`, which is the B evidence tier), label "LDL-friendly" (the goal's short name + "-friendly"). Use on recipe cards.
- **Strong fit, starburst:** the same words in a 24-point `mustard` starburst, 96–112px. Use only on the welcome screen, onboarding and marketing, never on recipe or Why pages.
- **Partial fit (retired in v2):** every dinner now meets one LDL-friendly bar, so there is no partial level.
- **Family favorite:** `white` pill, weight 700, no icon, on familiar dinners adapted for the goal.
- **Warning:** `cherry` pill with white text and an alert mark, for an allergen or medication flag ("Contains nuts," "Grapefruit: check your meds").
- **Filter tag (future):** `mint` pill, weight 500, no icon ("Kid-friendly," "Feeds a crowd"). Show at most one beside the goal tag, then "+N."
- Pills: 30px tall, `stroke-ink` `navy` border, 13px, `radius-pill`. Goal tags weight 700.
- The consumer provides the user's goal and fit level for this recipe; the badge never states a health outcome or a creator's claim.
- Show it only to the signed-in user, never in shared or public views. Warnings always win over a fit badge.
