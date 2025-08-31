import { getGlossaryTerms } from '@app/_utils/get-glossary-terms';
import { AlphabetNav } from './alphabet-nav';
import { TermsList } from './terms-list';

export async function GlossaryContent() {
  const terms = await getGlossaryTerms();

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">UX Patterns Glossary</h1>
      <p className="text-lg mb-12">
        A comprehensive glossary of UX patterns and web development terminology. This resource is
        designed to help developers and designers understand the key concepts, patterns, and
        principles discussed throughout our documentation.
      </p>

      <AlphabetNav />
      <TermsList terms={terms} />
    </>
  );
}
