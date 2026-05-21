export const ResponsiveDimensions = {
  setBaseDimensions: jest.fn(),
  scale: jest.fn(x => x),
  s: jest.fn(x => x),
  verticalScale: jest.fn(x => x),
  vs: jest.fn(x => x),
  moderateScale: jest.fn(x => x),
  ms: jest.fn(x => x),
  moderateVerticalScale: jest.fn(x => x),
  mvs: jest.fn(x => x),
  percentWidth: jest.fn(x => x),
  pw: jest.fn(x => x),
  percentHeight: jest.fn(x => x),
  ph: jest.fn(x => x),
};

export const multiply = jest.fn((a, b) => a * b);

export const getStatusBarHeight = jest.fn(() => 0);
