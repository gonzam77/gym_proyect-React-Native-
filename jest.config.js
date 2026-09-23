module.exports = {
  preset: 'react-native',
  // El preset de react-native no transforma .jsx y casi toda la app lo usa.
  transform: {
    '^.+\\.jsx$': 'babel-jest',
  },
};
