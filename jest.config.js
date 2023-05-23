module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  transformIgnorePatterns: ["node_modules/(?!axios)/"]
};
