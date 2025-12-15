const baselightTheme = {
  direction: "ltr",
  palette: {
    primary: {
      main: "#1e4db7",
      light: "#e5fafb",
      dark: "#1e4db7",
    },
    secondary: {
      main: "#fb9678",
      light: "#fcf1ed",
      dark: "#e67e5f",
    },
    success: {
      main: "#00c292",
      light: "#ebfaf2",
      dark: "#00964b",
      contrastText: "#ffffff",
    },
    info: {
      main: "#0bb2fb",
      light: "#a7e3f4",
      dark: "#0bb2fb",
      contrastText: "#ffffff",
    },
    error: {
      main: "#e46a76",
      light: "#fdf3f5",
      dark: "#e45a68",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#fec90f",
      light: '#fff4e5',
      dark: "#dcb014",
      contrastText: "#ffffff",
    },
    purple: {
      A50: "#EBF3FE",
      A100: "#6610f2",
      A200: "#557fb9",
    },
    grey: {
      100: "#F2F6FA",
      200: "#EAEFF4",
      300: "#DFE5EF",
      400: "#767e89",
      500: "#5A6A85",
      600: "#2A3547",
    },
    text: {
      primary: "#000",
      secondary: "rgba(0,0,0,0.87)",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "#fafbfb",
      dark: "#fafbfb",
      paper: "#fafbfb",
    },
  },
};

const baseDarkTheme = {
  direction: "ltr",
  palette: {
    primary: {
      main: "#03c9d7",
      light: "#ECF2FF",
      dark: "#4570EA",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#fb9678",
      light: "#1C455D",
      dark: "#173f98",
      contrastText: "#ffffff",
    },
    success: {
      main: "#00c292",
      light: "#1B3C48",
      dark: "#00964b",
      contrastText: "#ffffff",
    },
    info: {
      main: "#539BFF",
      light: "#223662",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#e46a76",
      light: "#4B313D",
      dark: "#e45a68",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#fec90f",
      light: "#4D3A2A",
      dark: "#dcb014",
      contrastText: "#ffffff",
    },
    purple: {
      A50: "#EBF3FE",
      A100: "#6610f2",
      A200: "#557fb9",
    },
    grey: {
      100: "#333F55",
      200: "#465670",
      300: "#7C8FAC",
      400: "#DFE5EF",
      500: "#EAEFF4",
      600: "#F2F6FA",
    },
    text: {
      primary: "#e6e5e8",
      secondary: "#adb0bb",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#333F55",
    },
    divider: "#333F55",
    background: {
      default: "#171c23",
      dark: "#171c23",
      paper: "#282c34",
    },
  },
};

export { baseDarkTheme, baselightTheme };
