import React from 'react';

export function WordpressContentRenderer(props: { content: unknown }) {
  return <div dangerouslySetInnerHTML={{ __html: props.content as string }} />;
}
