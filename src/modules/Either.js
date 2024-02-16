/**
 * @param {Error} left: Specify error value
 * @param {*} right: Specify success value
 * @returns {{error: Error} | { result: any}}
 */
const Either = (left, right) => {
  if (right) return { result: right };
  if (left) return { error: left };
};

module.exports = {
  Right: (result) => Either(null, result),
  Left: (err) => Either(err, null),
};
