/**
 * Decodes HTML entities in a string
 * Converts entities like &Atilde; → Ã, &aacute; → á
 */
export const decodeHTMLEntities = (html: string): string => {
  if (!html) return html;

  // Use DOMParser for robust HTML entity decoding
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<!DOCTYPE html><body>${html}</body>`,
    "text/html",
  );

  // Return the parsed HTML content
  return doc.body.innerHTML;
};
