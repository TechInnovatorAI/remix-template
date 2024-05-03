import { DocumentElement } from '@keystatic/core';
import { DocumentRenderer } from '@keystatic/core/renderer';

export function KeystaticDocumentRenderer(props: { content: unknown }) {
  return <DocumentRenderer document={props.content as DocumentElement[]} />;
}
