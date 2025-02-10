import { getGlossaryTerms } from "@app/_utils/get-glossary-terms";
import { Suspense } from 'react';
import { TermsList } from "./terms-list";

function LoadingTerms() {
  return <div>Loading glossary terms...</div>;
}

export function TermsListContainer() {
  return (
    <Suspense fallback={<LoadingTerms />}>
      <TermsListContent />
    </Suspense>
  );
}

async function TermsListContent() {
  const terms = await getGlossaryTerms();

  if (!terms || terms.length === 0) {
    return <p>No glossary terms found.</p>;
  }

  return <TermsList terms={terms} />;
}
