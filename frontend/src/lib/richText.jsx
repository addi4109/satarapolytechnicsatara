const TOKEN_PATTERN = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function renderRichTextParagraphs(text) {
  if (!text) return null;

  return text
    .split('\n')
    .filter((paragraph) => paragraph.trim())
    .map((paragraph, paragraphIndex) => (
      <p key={paragraphIndex}>
        {paragraph.split(TOKEN_PATTERN).map((token, tokenIndex) => {
          if (token.startsWith('***') && token.endsWith('***')) {
            return <strong key={tokenIndex}><em>{token.slice(3, -3)}</em></strong>;
          }
          if (token.startsWith('**') && token.endsWith('**')) {
            return <strong key={tokenIndex}>{token.slice(2, -2)}</strong>;
          }
          if (token.startsWith('*') && token.endsWith('*')) {
            return <em key={tokenIndex}>{token.slice(1, -1)}</em>;
          }
          return token;
        })}
      </p>
    ));
}
