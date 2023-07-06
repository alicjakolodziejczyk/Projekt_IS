import React from 'react'

function Progress(props) {
  return (
    <div style={{height: "25px", display: 'flex', borderRadius: '12px', overflow: "hidden"}}>
      <div style={{width: props.past, height: '100%', backgroundColor: "blue"}}></div>
      <div style={{width:props.present, height: '100%', backgroundColor: "purple"}}></div>
      <div style={{width: props.future, height: '100%', backgroundColor: "pink"}}></div>
    </div>
  )
}

export default Progress