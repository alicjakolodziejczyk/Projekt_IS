import React, { useRef, useState } from 'react';
import { GraphCanvas, useSelection } from 'reagraph'

function Graph(props) {
  const graphRef = useRef(null);
  const { nodes, edges } = props;

  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick,
  } = useSelection({
    ref: graphRef,
    nodes,
    edges,
    pathSelectionType: 'out'
  });

  return (
    <GraphCanvas
      selections={selections}
      actives={actives}
      onCanvasClick={onCanvasClick}
      onNodeClick={onNodeClick}
      ref={graphRef}
      labelType={props.visible ? ('all') : ('nodes')}
      nodes={nodes}
      edges={edges}
      theme={props.darkTheme}
      draggable
      edgeArrowPosition="none"
    />
  );
}

export default Graph;
