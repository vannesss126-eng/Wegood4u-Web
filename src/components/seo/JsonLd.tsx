import type { Graph, Thing, WithContext } from "schema-dts";

/** A single entity, or a `@graph` of connected ones (what the layout emits). */
type Schema = WithContext<Thing> | Graph;

/**
 * JSON-LD emitter.
 *
 * The escaping is the point. A `<script type="application/ld+json">` block is
 * parsed as raw text, so the FIRST `</script` inside it ends the block — a
 * string containing `</script><img onerror=…>` would break out into live HTML.
 * `JSON.stringify` does not escape `<`, so we do.
 *
 * `<` is valid inside a JSON string and parses back to `<`, so consumers
 * see identical data. This is DIRECTION-SECURITY's "escape `<`" rule applied at
 * the one place it is easy to forget.
 *
 * Every field here is repo-authored today, but Phase 5's venue and story schema
 * will carry member-submitted text. Build the habit before the first UGC page
 * ships, not after.
 */
export default function JsonLd({ schema }: { schema: Schema }) {
  const json = JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    // U+2028/U+2029 are legal inside JSON but are line terminators in
    // JavaScript, so an inlined payload containing one can break a consuming
    // parser. Matched via escape sequences — a literal U+2028 in this source
    // file would itself be a line break and would not compile.
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return (
    <script
      type="application/ld+json"
      // Escaped above; there is no path from this value back into markup.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
