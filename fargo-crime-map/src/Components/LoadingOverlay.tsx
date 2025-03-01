import React from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Loading data..." }) => {
    return (
        <Flex
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="9999"
            backgroundColor="blackAlpha.600"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text mt={4} color="white" fontWeight="bold">
                {message}
            </Text>
        </Flex>
    );
};

export default LoadingOverlay;
