export const whichAnimationEvent = () => {
  const el = document.createElement('fakeelement');
  const transitions = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
  }

  let transition = null;

  Object.keys(transitions).forEach((t) => {
    if (typeof el.style[t] !== 'undefined') {
      transition = transitions[t];
    }
  });
  return transition;
}


export const whichTransitionEvent = () => {
  const el = document.createElement('fakeelement');
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  }

  let transition = null;

  Object.keys(transitions).forEach((t) => {
    if (typeof el.style[t] !== 'undefined') {
      transition = transitions[t];
    }
  });
  return transition;
}
