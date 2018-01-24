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
  const keys1 = val1.map(child => child.key);
  const keys2 = val2.map(child => child.key);

  // diferent size
  if (keys1.length !== keys2.length) return false;

  // check each key
  for (let i = 0; i < keys1.length; i++){
    if(keys1[i] !== keys2[i]) return false;
  }

  return true;
}
