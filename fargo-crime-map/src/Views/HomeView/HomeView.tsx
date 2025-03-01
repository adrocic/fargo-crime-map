import { Flex, Image, useTheme, Box, Heading, Text, Button, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaMapMarkedAlt, FaChartBar } from "react-icons/fa";
import MapView from "Views/MapView/MapView";
import ViewSelector from "Views/ViewSelector/ViewSelector";
import { useState } from "react";

const HomeView = () => {
    const theme = useTheme();
    const [activeView, setActiveView] = useState<"Data" | "Map">("Map");
    const headerBg = useColorModeValue("white", "gray.800");
    const headerShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";

    const handleSelection = (selection: "Data" | "Map") => {
        setActiveView(selection);
    };

    return (
        <Flex width="100vw" height="100vh" bg="gray.50" flexDirection="column" overflow="hidden">
            {/* Header */}
            <Flex
                py={3}
                px={6}
                bg={headerBg}
                boxShadow={headerShadow}
                align="center"
                justify="space-between"
            >
                <Flex align="center">
                    <Image height="50px" src="/logo-color.svg" mr={4} />
                    <Box>
                        <Heading size="md" color={theme.colors.primary}>
                            Fargo Crime Map
                        </Heading>
                        <Text fontSize="xs" color="gray.500">
                            Visualizing safety in our community
                        </Text>
                    </Box>

                <Flex gap={2}>
                    <Button
                        size="sm"
                        leftIcon={<Icon as={FaMapMarkedAlt} />}
                        colorScheme={activeView === "Map" ? "blue" : "gray"}
                        variant={activeView === "Map" ? "solid" : "outline"}
                        onClick={() => handleSelection("Map")}
                    >
                        Map View
                    </Button>
                    <Button
                        size="sm"
                        leftIcon={<Icon as={FaChartBar} />}
                        colorScheme={activeView === "Data" ? "blue" : "gray"}
                        variant={activeView === "Data" ? "solid" : "outline"}
                        onClick={() => handleSelection("Data")}
                    >
                        Data View
                    </Button>
                </Flex>
            </Flex>

            {/* Main Content */}
            <Flex flex={1} overflow="hidden">
                {activeView === "Map" && (
                    <Box flex={1}>
                        <MapView />
                    </Box>
                )}
                {activeView === "Data" && (
                    <Flex justify="center" align="center" flex={1} bg="white">
                        <Text>Data view coming soon...</Text>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default HomeView;
