const values = new Map();

const asyncStorage = {
  getItem: jest.fn(async (key) => (values.has(key) ? values.get(key) : null)),
  setItem: jest.fn(async (key, value) => {
    values.set(key, value);
  }),
  removeItem: jest.fn(async (key) => {
    values.delete(key);
  }),
  multiRemove: jest.fn(async (keys) => {
    keys.forEach((key) => values.delete(key));
  }),
  clear: jest.fn(async () => {
    values.clear();
  }),
  reset: () => {
    values.clear();
    jest.clearAllMocks();
  },
  values,
};

module.exports = { __esModule: true, default: asyncStorage };