import React from 'react';
import Retry from './Retry/Retry';

export default function Loading(props) {
  const { disable } = props;

  if (disable) {
    return null;
  }

  if (props.isLoading) {
    // tiempo que tu consideras timeout
    if (props.timedOut) {
      // return <div>Loader timed out!</div>;
    }
    // tiempo intermedio
    if (props.pastDelay) {
      // return <div>Loading...</div>;
    }
    // de momento null, entre cambio de páginas no habrá nada en pantalla
    return null;
    // en caso de error
  } if (props.error) {
    return (
      <Retry onClick={props.retry} />
    );
  }
  return null;
}
