/* eslint-disable no-bitwise */

import queryString from 'query-string';
import React from 'react';
import reactHtmlParser from 'react-html-parser';

export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

export const getText = (texts, language, id) => {
  const fieldName = language === 'es' ? 'contenidoES' : 'contenidoEN';
  const text = texts.find(item => item.idTexto === id);

  if (text) {
    return reactHtmlParser(text[fieldName]);
  }
  return '';
}


export const formatDate = (stringDate) => {
  const tokken = stringDate.split('-');
  return `${tokken[2]}/${tokken[1]}/${tokken[0]}`;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const getLightenDarkenColor = (color, percent) => {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255)?R:255;  
  G = (G < 255)?G:255;  
  B = (B < 255)?B:255;  

  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return `#${RR}${GG}${BB}`;
}

export const getUrlParams = () => {
  let params = null;
  try {
    // detecting if we have # has router
    const hashInfo = !!window.location.hash;
    const searchParams = !!window.location.search;
    const hashRouterParasm = hashInfo && !searchParams && (window.location.hash.indexOf('?') > -1);
    if (hashRouterParasm) {
      const beginPosition = window.location.hash.indexOf('?');
      const string2Analise = window.location.hash.substr(beginPosition);
      params = queryString.parse(string2Analise);
    } else {
      params = queryString.parse(window.location.search);
    }
  } catch (err) {
    console.error('Error on [getUrlParams] in jsUtils file');
  }
  return params;
}

export const giveRandomNumber = (min, max) => Math.floor(Math.random() * max) + min;

export const isSafariBrowser = () => {
  let res = false;
  try {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
      if (!(ua.indexOf('chrome') > -1)) {
        res = true;
      }
    }
  } catch (err) { /* console.log('something failed on this browser'); */ }
  return res;
}

export const setCookie = (cName, value, exdays) => {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  const cValue = escape(value) + ((exdays === null) ? '' : `;expires=${exdate.toUTCString()};path=/`);
  document.cookie = `${cName}=${cValue}`;
}

export const getFirstPathOfUrl = (url) => {
  let res = '';
  if (url) {
    const tokken = url.split('/');
    if (tokken[1]) {
      res = `/${tokken[1]}`;
    }
  }
  return res;
}

export const normalizeString = (string) => {
  return string && string.normalize ? string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';
}

export const cmp2String = (str1 = '', str2 = '') => {
  const str1aux = normalizeString(str1);
  const str2aux = normalizeString(str2);
  return str1aux.indexOf(str2aux) > -1;
}

export const getCookie = (cName) => {
  let cValue = document.cookie;
  let cStart = cValue.indexOf(` ${cName}=`);
  if (cStart === -1) {
    cStart = cValue.indexOf(`${cName}=`);
  }
  if (cStart === -1) {
    cValue = null;
  } else {
    cStart = cValue.indexOf('=', cStart) + 1;
    let cEnd = cValue.indexOf(';', cStart);
    if (cEnd === -1) {
      cEnd = cValue.length;
    }
    cValue = unescape(cValue.substring(cStart, cEnd));
  }
  return cValue;
}

export const setCss2Element = (id, className) => {
  const element = document.getElementById(id);
  if (element) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }
}

export const generateComponentId = (componentName, aditionalId = '', id = giveRandomNumber(1, 99999)) => {
  return `${componentName}-${id}${aditionalId ? `-${aditionalId}` : ''}`;
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}

export const howAppIsRunning = () => {
  const { NODE_ENV } = process.env;
  return NODE_ENV;
}

export const areEqualsObject = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

export const getRandomBetween = max => (
  Math.floor(Math.random() * max) + 1  
)


export const sumArray = (arr) => {
  if (arr.length > 0) {
    return arr.reduce((sum, x) => sum + x);
  }
  return null
}


export const slugify = (string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export const slideDown = (id, finalheight, duration) => {
  const element = document.getElementById(id);
  const s = element.style;
  s.height = '0px';
  let y = 0;
  let currentFrame = 0;
  const framerate = 30;
  const oneSecond = 1000;
  const interval = oneSecond * duration / framerate;
  const totalframes = oneSecond * duration / interval;
  const heightincrement = finalheight / totalframes;
  const tween = () => {
    y += heightincrement;
    if (currentFrame < totalframes) {
      s.height = `${y}px`;
      currentFrame += 1;
      setTimeout(tween, interval);
    } else {
      s.height = 'auto';
    }
  }
  tween();
}

export const slideUp = (id, duration) => {
  const element = document.getElementById(id);
  const s = element.style;
  s.height = `${element.offsetHeight}px`;
  let y = element.offsetHeight; // 132
  // let currentFrame = 0;
  const framerate = 30;
  const oneSecond = 1000;
  const interval = oneSecond * duration / framerate; // 17
  const totalframes = (oneSecond * duration / interval); // 30
  const heightincrement = element.offsetHeight / totalframes; // 4.40000547
  // const heightincrementOneDecimal = parseInt(heightincrement.toFixed(2), 10)
  const tween = () => {
    y -= heightincrement;
    if (y < 0) {
      y = 0
    }
    s.height = `${y}px`;
    /* if (currentFrame <= totalFramesGood) {
      currentFrame += 1;
      setTimeout(tween, interval);
    } */
    if (y > 0) {
      // currentFrame += 1;
      setTimeout(tween, interval);
    }
  }
  tween();
}
