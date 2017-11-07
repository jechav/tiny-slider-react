export const ObjectsIqual = (val1, val2) => {
  return JSON.stringify({a: val1}) === JSON.stringify({a: val2})
}
