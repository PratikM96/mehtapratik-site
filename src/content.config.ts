import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections — the typed build guardrail (Build-Spec §"Content schema").
 *
 * `work` is the canonical case-study list. The schema below is the build-spec
 * sketch extended with the structured section data both templates already use,
 * so /work/[slug] can render the SPORTIME (client) and The Ninth (concept)
 * pages identically from data. A required field that is missing or wrong-shaped
 * FAILS THE BUILD rather than shipping empty:
 *   - type 'client' MUST carry a verified headline `metric`
 *   - type 'concept' MUST carry `scope`
 * enforced by the .refine() at the bottom.
 */

// A margin-rail module — mirrors MarginRail.astro's prop union exactly.
const marginModule = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('meta'),
    label: z.string(),
    rows: z.array(z.object({ k: z.string(), v: z.string() })),
  }),
  z.object({
    type: z.literal('stat'),
    label: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    desc: z.string(),
  }),
  z.object({
    type: z.literal('quote'),
    quote: z.string(),
    who: z.string(),
  }),
  z.object({
    type: z.literal('note'),
    label: z.string(),
    text: z.string(),
  }),
]);

// A prose paragraph; `lead` becomes the bold lead-in run when present.
const paragraph = z.object({ lead: z.string().optional(), text: z.string() });

// A section that pairs prose with a margin rail.
const proseSection = z.object({
  prose: z.array(paragraph),
  margin: z.array(marginModule).default([]),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z
    .object({
      // --- identity / facet (build-spec core) ---
      title: z.string(),
      slug: z.string(),
      type: z.enum(['client', 'concept']), // drives the visible facet + filtering
      role: z.string(), // rail scoreboard Role
      year: z.string(), // rail scoreboard Year
      disciplines: z.array(z.string()),
      cover: z.string().url(),
      featured: z.boolean().default(false),
      description: z.string(), // <meta name="description">

      // --- hero ---
      badge: z.string(),
      lede: z.string(),
      coverAlt: z.string(),
      coverCaption: z.string(),
      hero: z.array(
        z.object({
          k: z.string(),
          v: z.string(),
          metric: z.boolean().optional(), // accent unit (verified result)
          scope: z.boolean().optional(), // neutral unit (concept scope count)
          unit: z.string().optional(),
        }),
      ),

      // --- spine sections ---
      problem: proseSection,
      system: proseSection.extend({
        steps: z.array(z.object({ ix: z.string(), title: z.string(), text: z.string() })),
      }),
      decisions: proseSection.extend({
        items: z.array(z.object({ n: z.string(), title: z.string(), text: z.string() })),
      }),
      output: z.object({
        tiles: z.array(
          z.object({
            // data-driven grid span: a 'wide' asset takes its own full-width row
            span: z.enum(['standard', 'wide']).default('standard'),
            img: z.string().url().optional(),
            alt: z.string().optional(),
            ph: z.string().optional(),
            caption: z.string(),
          }),
        ),
        note: z.string().optional(),
      }),
      reflection: proseSection,
      next: z.object({ kicker: z.string(), title: z.string(), href: z.string() }),

      // --- proof (guardrail fields + display data) ---
      // client work MUST carry a verified headline metric; concept MUST carry scope.
      metric: z.object({ value: z.string(), label: z.string() }).optional(),
      scope: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
      // client proof box: full metric row + verified testimonial
      proofMetrics: z
        .array(z.object({ value: z.string(), unit: z.string().optional(), label: z.string() }))
        .optional(),
      testimonial: z.object({ quote: z.string(), source: z.string() }).optional(),
      // concept proof box: rationale line (no results claimed)
      rationale: z.object({ label: z.string(), text: z.string() }).optional(),
      // concept embedded demo: tabbed island linking to /concepts/[project]/
      demo: z
        .object({
          project: z.string(),
          heading: z.string(),
          foot: z.string(),
          alt: z.string().optional(),
          tabs: z.array(z.object({ label: z.string(), cap: z.string(), img: z.string().url() })),
        })
        .optional(),
    })
    .refine((d) => (d.type === 'client' ? !!d.metric : !!d.scope), {
      message: 'client needs a verified metric; concept needs scope',
    }),
});

export const collections = { work };
