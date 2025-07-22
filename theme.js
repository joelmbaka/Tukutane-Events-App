import { createTheme } from '@rneui/themed';

export default createTheme({
  lightColors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    background: '#FFFFFF',
    white: '#FFFFFF',
    black: '#000000',
    grey0: '#F8F9FA',
    grey1: '#E9ECEF',
    grey2: '#DEE2E6',
    grey3: '#CED4DA',
    grey4: '#ADB5BD',
    grey5: '#6C757D',
    greyOutline: '#6C757D',
    searchBg: '#E9ECEF',
  },
  darkColors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    background: '#121212',
    white: '#FFFFFF',
    black: '#000000',
    grey0: '#1E1E1E',
    grey1: '#2D2D2D',
    grey2: '#3D3D3D',
    grey3: '#4D4D4D',
    grey4: '#5D5D5D',
    grey5: '#6C757D',
    greyOutline: '#6C757D',
    searchBg: '#2D2D2D',
  },
  mode: 'light',
  components: {
    Button: {
      buttonStyle: {
        borderRadius: 8,
      },
      titleStyle: {
        fontWeight: 'bold',
      },
    },
    Card: {
      containerStyle: {
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
  },
});
