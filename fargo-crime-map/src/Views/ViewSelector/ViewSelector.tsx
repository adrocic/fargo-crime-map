import { Flex, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";

type ViewSelectorProps = {
    onSelection: (selection: "Data" | "Map") => void;
};

const ViewSelector = ({ onSelection }: ViewSelectorProps) => {
    const [selected, setSelected] = useState<"Data" | "Map">("Data");

    const primaryColor = useColorModeValue("primary", "secondary");
    const handleSelection = (selection: "Data" | "Map") => {
        setSelected(selection);
        onSelection(selection);
    };

    return (
        <Flex justify="space-around" align="center" p={6} bg="secondary">
            {(["Data", "Map"] as const).map((item) => (
                <Box
                    key={item}
                    position="relative"
                    cursor="pointer"
                    onClick={() => handleSelection(item)}
                    w="fit-content"
                >
                    <Text
                        fontSize="4xl"
                        fontWeight={selected === item ? "bold" : "normal"}
                        color={selected === item ? primaryColor : "black"}
                    >
                        {item}
                    </Text>
                    <Box
                        position="absolute"
                        bottom={-2}
                        left={selected === item ? "-20%" : "0"}
                        right={selected === item ? "-20%" : "0"}
                        height={selected === item ? "7px" : "5px"}
                        borderRadius="5px"
                        backgroundColor={selected === item ? primaryColor : "transparent"}
                        transition="all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" // Spring effect
                        _after={{
                            borderRadius: "5px",
                            content: '""',
                            position: "absolute",
                            left: 0,
                            right: 0,
                            height: "100%",
                            background:
                                selected === item
                                    ? "linear-gradient(to right, red, white, blue, red)" // Red and blue gradient
                                    : "transparent",
                            backgroundSize: "200% 100%",
                            animation: selected === item ? "rainbow 2s linear infinite" : "none", // Faster animation
                        }}
                    />
                </Box>
            ))}
            <style>
                {`
          @keyframes rainbow {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
            </style>
        </Flex>
    );
};

export default ViewSelector;
