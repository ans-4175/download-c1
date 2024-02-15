const Either = (left, right) => {
  if (right) return { result: right };
  if (left) return { error: left };
};

module.exports = {
  Right: (result) => Either(null, result),
  Left: (err) => Either(err),
};
