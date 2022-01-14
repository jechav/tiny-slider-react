import React from 'react';

/**
 * Compare two objects using stringify
 * @returns {Boolean}
 */
export const ObjectsEqual = (val1, val2) => {
  return JSON.stringify({a: val1}) === JSON.stringify({a: val2})
}

/**
 * Compare two children by keys
 * @returns {Boolean}
 */
export const ChildrenEqual = (val1, val2) => {
  const keys1 = React.Children.map(val1, child => child.key);
  const keys2 = React.Children.map(val2, child => child.key);

  // diferent size
  if (keys1.length !== keys2.length) return false;

  // check each key
  for (let i = 0; i < keys1.length; i++){
    if(keys1[i] !== keys2[i]) return false;
  }

  return true;
}
