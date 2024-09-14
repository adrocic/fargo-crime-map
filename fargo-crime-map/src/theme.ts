import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    colors: {
        primary: "#1E91FF", // Close to Dodger Blue, but slightly more green
        secondary: "#f5f5f5", // A very slightly off-white color
        black: "#333333", // A shade of black that is easy on the eyes
    },
    fonts: {
        heading: "Monaco, monospace", // Using Monaco for headings
        body: "Roboto, sans-serif", // Using Roboto for body
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: "bold",
            },
            variants: {
                solid: {
                    bg: "primary",
                    color: "white",
                    _hover: {
                        bg: "secondary",
                    },
                },
                outline: {
                    borderColor: "primary",
                    color: "primary",
                    _hover: {
                        bg: "secondary",
                    },
                },
            },
        },
    },
});

export default theme;
