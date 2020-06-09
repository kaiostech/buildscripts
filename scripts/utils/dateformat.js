const DateFormat = {
  yyyymmddhhmmss: date => date.toISOString().replace(/[A-Z:.-]/g, '').slice(0, -3)
};

module.exports = DateFormat;
