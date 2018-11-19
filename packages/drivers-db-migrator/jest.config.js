module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  preset: 'ts-jest',
  testMatch: null,
}
