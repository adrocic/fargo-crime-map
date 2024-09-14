import { Flex, Image, useTheme } from "@chakra-ui/react";
import MyDatePicker from "Components/MyDatePicker";
import MapView from "Views/MapView/MapView";
import ViewSelector from "Views/ViewSelector/ViewSelector";

const JustData = () => {
    const theme = useTheme();

    const handleSelection = (selection: "Data" | "Map") => {
        // Handle the selection (e.g., render Data or Map component)
        console.log(`Selected: ${selection}`);
    };

    return (
        <Flex width="100vw" height="100vh" bg="white">
            <Flex flexDir="column" width="100%">
                <Flex justifyContent="center">
                    <Image height={500} src="/logo-color.svg" />
                </Flex>
                <ViewSelector onSelection={handleSelection} />
                <Flex bg={theme.colors.secondary}>
                    <MapView />
                </Flex>
            </Flex>
            {/* eslint-disable-next-line */}
        </Flex>
    );
};

export default JustData;
