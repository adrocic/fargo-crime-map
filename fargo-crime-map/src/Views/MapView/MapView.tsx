import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Flex,
    CircularProgress,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    Text,
    useColorModeValue,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    Icon,
    Tooltip,
    Heading,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { subDays } from "date-fns";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
    FaMapMarkerAlt,
    FaExclamationTriangle,
    FaThermometerHalf,
    FaCalendarAlt,
    FaChartBar,
    FaMapMarked,
} from "react-icons/fa";
import useQueryCrimeData from "../../Hooks/QueryCrimeData/useQueryCrimeData";
import HeatmapLayer from "../../Components/HeatmapLayer/HeatmapLayer";
import "leaflet/dist/leaflet.css";
import Filters from "../../Components/Filters/Filters";
import CrimeBarChart from "../../Components/Charts/CrimeBarChart";
import CrimePieChart from "../../Components/Charts/CrimePieChart";
import CrimeTimelineChart from "../../Components/Charts/CrimeTimelineChart";

interface CrimeData {
    latitude: string;
    longitude: string;
    type?: string;
    description?: string;
    address?: string;
    date?: string;
    id?: string;
    [key: string]: string | undefined;
}

const MapView: React.FC = () => {
    // Set default date range to yesterday and today
    const today = new Date();
    const yesterday = subDays(today, 1);

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([yesterday, today]);
    const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const filtersBg = useColorModeValue("white", "gray.800");
    const filtersBoxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    const popupBg = useColorModeValue("white", "gray.800");
    const cardBg = useColorModeValue("white", "gray.800");

    const getCrimeColor = (type: string = ""): string => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes("theft") || lowerType.includes("burglary")) return "red.500";
        if (lowerType.includes("assault")) return "orange.500";
        if (lowerType.includes("drug")) return "purple.500";
        return "blue.500";
    };

    const {
        crimeData,
        isLoadingCrimeData,
        isErrorCrimeData,
        errorMessage: queryErrorMessage,
    } = useQueryCrimeData({
        startDate: dateRange[0],
        endDate: dateRange[1],
    });

    // Set error message from query
    useEffect(() => {
        if (isErrorCrimeData && queryErrorMessage) {
            setErrorMessage(queryErrorMessage);
        } else {
            setErrorMessage(null);
        }
    }, [isErrorCrimeData, queryErrorMessage]);

    const heatmapPoints = useMemo(() => {
        if (!crimeData || !Array.isArray(crimeData)) return [];

        return crimeData
            .filter(
                (data: CrimeData) =>
                    data &&
                    data.latitude &&
                    data.longitude &&
                    !Number.isNaN(parseFloat(data.latitude)) &&
                    !Number.isNaN(parseFloat(data.longitude)),
            )
            .map((data: CrimeData): [number, number, number] => {
                const lat = parseFloat(data.latitude);
                const lng = parseFloat(data.longitude);
                return [lat, lng, 1];
            });
    }, [crimeData]);

    // Crime statistics
    const crimeStats = useMemo(() => {
        if (!crimeData || !Array.isArray(crimeData)) return { total: 0, types: {} };

        const types: Record<string, number> = {};
        const dates: Record<string, number> = {};

        crimeData.forEach((crime: CrimeData) => {
            // Process crime types
            const type = crime.type || "Unknown";
            types[type] = (types[type] || 0) + 1;

            // Process crime dates for timeline
            if (crime.date) {
                const dateStr = new Date(crime.date).toLocaleDateString();
                dates[dateStr] = (dates[dateStr] || 0) + 1;
            }
        });

        return {
            total: crimeData.length,
            types,
            dates,
        };
    }, [crimeData]);

    // Get the top 3 crime types
    const topCrimeTypes = useMemo(() => {
        if (!crimeStats.types) return [];
        return Object.entries(crimeStats.types)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
    }, [crimeStats]);

    // Prepare data for visualization charts
    const chartData = useMemo(() => {
        // Bar chart data - top 10 crime types
        const barChartData = Object.entries(crimeStats.types || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([category, count]) => ({ category, count }));

        // Pie chart data - crime type distribution
        const pieChartData = Object.entries(crimeStats.types || {}).map(([label, value]) => ({ label, value }));

        // Timeline data - crimes by date
        const timelineData = Object.entries(crimeStats.dates || {})
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([date, count]) => ({ date, count }));

        return {
            barChartData,
            pieChartData,
            timelineData,
        };
    }, [crimeStats]);

    return (
        <Box position="relative" height="100%" width="100%" overflow="hidden" p={4}>
            {/* Error Alert */}
            {errorMessage && (
                <Alert
                    status="error"
                    position="absolute"
                    top="4"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex="banner"
                    width="auto"
                    borderRadius="md"
                    boxShadow="md"
                >
                    <AlertIcon />
                    <Box flex="1">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription display="block">{errorMessage}</AlertDescription>
                    </Box>
                    <CloseButton position="absolute" right="8px" top="8px" onClick={() => setErrorMessage(null)} />
                </Alert>
            )}

            {/* Loading Indicator */}
            {isLoadingCrimeData && (
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    zIndex="overlay"
                    alignItems="center"
                    justifyContent="center"
                    bg="blackAlpha.300"
                    backdropFilter="blur(2px)"
                >
                    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="xl" textAlign="center">
                        <CircularProgress isIndeterminate color="blue.500" size="60px" thickness="4px" />
                        <Text mt={4} fontWeight="medium">
                            Loading crime data...
                        </Text>
                    </Box>
                </Flex>
            )}

            {/* Main Dashboard Layout */}
            <Grid
                templateColumns={{ base: "1fr", lg: "350px 1fr" }}
                templateRows={{ base: "auto 1fr", lg: "1fr" }}
                gap={4}
                height="100%"
            >
                {/* Filters & Stats Column */}
                <GridItem>
                    <Flex direction="column" height="100%" gap={4}>
                        {/* Filters Panel */}
                        <Box
                            bg={filtersBg}
                            borderRadius="lg"
                            p={4}
                            boxShadow={filtersBoxShadow}
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <Filters
                                dateRange={dateRange}
                                onDateRangeChange={setDateRange}
                                showHeatmap={showHeatmap}
                                onHeatmapChange={setShowHeatmap}
                            />
                        </Box>

                        {/* Crime Statistics */}
                        {!isLoadingCrimeData && crimeStats.total > 0 && (
                            <Box
                                bg={cardBg}
                                borderRadius="lg"
                                p={4}
                                boxShadow={filtersBoxShadow}
                                border="1px solid"
                                borderColor={borderColor}
                                flex="1"
                                overflowY="auto"
                            >
                                <Heading size="md" mb={4}>
                                    Crime Statistics
                                </Heading>
                                <StatGroup mb={4}>
                                    <Stat>
                                        <StatLabel>Total Incidents</StatLabel>
                                        <StatNumber>{crimeStats.total}</StatNumber>
                                    </Stat>
                                    <Stat textAlign="right">
                                        <StatLabel>
                                            {showHeatmap ? (
                                                <Flex alignItems="center" justifyContent="flex-end">
                                                    <Text mr={2}>Heat Map</Text>
                                                    <Icon as={FaThermometerHalf} color="red.500" />
                                                </Flex>
                                            ) : (
                                                <Flex alignItems="center" justifyContent="flex-end">
                                                    <Text mr={2}>Pin Map</Text>
                                                    <Icon as={FaMapMarkerAlt} color="blue.500" />
                                                </Flex>
                                            )}
                                        </StatLabel>
                                        <StatNumber>Active</StatNumber>
                                    </Stat>
                                </StatGroup>

                                {/* Date Range Info */}
                                <Flex align="center" mb={4}>
                                    <Icon as={FaCalendarAlt} color="blue.500" mr={2} />
                                    <Text fontSize="sm">
                                        {dateRange[0] && dateRange[1]
                                            ? `${dateRange[0].toLocaleDateString()} to ${dateRange[1].toLocaleDateString()}`
                                            : "No date range selected"}
                                    </Text>
                                </Flex>

                                {/* Top crimes */}
                                {topCrimeTypes.length > 0 && (
                                    <Box mt={3}>
                                        <Text fontSize="sm" fontWeight="medium" mb={2}>
                                            Top Incident Types:
                                        </Text>
                                        <Flex flexWrap="wrap" gap={2}>
                                            {topCrimeTypes.map(([type, count]) => (
                                                <Badge
                                                    key={type}
                                                    colorScheme={getCrimeColor(type).split(".")[0]}
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
                                                >
                                                    {type}: {count}
                                                </Badge>
                                            ))}
                                        </Flex>
                                    </Box>
                                )}

                                {/* Pie Chart */}
                                {chartData.pieChartData.length > 0 && (
                                    <Box mt={6} height="200px">
                                        <Text fontSize="sm" fontWeight="medium" mb={2}>
                                            Incident Type Distribution
                                        </Text>
                                        <CrimePieChart data={chartData.pieChartData} />
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Flex>
                </GridItem>

                {/* Map & Visualizations Column */}
                <GridItem>
                    <Flex direction="column" height="100%" gap={4}>
                        {/* Map Container */}
                        <Box
                            height="60%"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="0 0 20px rgba(0, 0, 0, 0.1)"
                            position="relative"
                        >
                            <Flex position="absolute" top={3} left={3} zIndex={10} bg="white" borderRadius="md" p={2}>
                                <Heading size="sm" display="flex" alignItems="center">
                                    <Icon as={FaMapMarked} mr={2} color="blue.500" />
                                    Fargo Crime Map
                                </Heading>
                            </Flex>

                            <MapContainer
                                style={{ height: "100%", width: "100%" }}
                                center={[46.8772, -96.7898]}
                                zoom={13}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />

                                {/* Render heatmap if enabled */}
                                {showHeatmap && heatmapPoints.length > 0 && (
                                    <HeatmapLayer
                                        points={heatmapPoints}
                                        options={{
                                            radius: 25,
                                            maxZoom: 17,
                                            blur: 15,
                                            gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
                                        }}
                                    />
                                )}

                                {/* Render markers if heatmap is disabled */}
                                {!showHeatmap &&
                                    crimeData &&
                                    crimeData.length > 0 &&
                                    crimeData.map((crime: CrimeData, index: number) => {
                                        if (!crime.latitude || !crime.longitude) return null;

                                        const lat = parseFloat(crime.latitude);
                                        const lng = parseFloat(crime.longitude);

                                        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

                                        const crimeType = crime.type || "Incident";
                                        const iconColor = getCrimeColor(crimeType);

                                        return (
                                            <Marker key={crime.id || `crime-${index}`} position={[lat, lng]}>
                                                <Popup>
                                                    <Box p={1} bg={popupBg}>
                                                        <Flex alignItems="center" mb={2}>
                                                            <Icon as={FaExclamationTriangle} color={iconColor} mr={2} />
                                                            <Text fontWeight="bold" fontSize="md">
                                                                {crimeType}
                                                            </Text>
                                                        </Flex>
                                                        <Text fontSize="sm" mb={2}>
                                                            {crime.description || "No description available"}
                                                        </Text>
                                                        <Text fontSize="xs" fontWeight="medium">
                                                            Address:
                                                        </Text>
                                                        <Text fontSize="xs" mb={2}>
                                                            {crime.address || "Unknown"}
                                                        </Text>
                                                        <Text fontSize="xs" fontWeight="medium">
                                                            Date:
                                                        </Text>
                                                        <Text fontSize="xs">
                                                            {crime.date
                                                                ? new Date(crime.date).toLocaleDateString()
                                                                : "Unknown"}
                                                        </Text>
                                                    </Box>
                                                </Popup>
                                            </Marker>
                                        );
                                    })}
                            </MapContainer>

                            {/* Legend/Info Box */}
                            <Box
                                position="absolute"
                                bottom="4"
                                right="4"
                                bg={bgColor}
                                p={3}
                                borderRadius="md"
                                boxShadow="md"
                                zIndex={1000}
                                maxWidth="300px"
                                borderColor={borderColor}
                                borderWidth="1px"
                            >
                                <Text fontSize="xs" opacity={0.8}>
                                    Data shown for selected date range. Toggle heatmap/pins in filter panel.
                                </Text>
                            </Box>
                        </Box>

                        {/* Additional Visualizations */}
                        <Box
                            height="40%"
                            bg={cardBg}
                            borderRadius="lg"
                            boxShadow={filtersBoxShadow}
                            border="1px solid"
                            borderColor={borderColor}
                            overflow="hidden"
                        >
                            <Tabs size="md" variant="enclosed" height="100%" display="flex" flexDirection="column">
                                <TabList px={4} pt={2}>
                                    <Tab fontWeight="medium" display="flex" alignItems="center">
                                        <Icon as={FaChartBar} mr={2} />
                                        Crime Types
                                    </Tab>
                                    <Tab fontWeight="medium" display="flex" alignItems="center">
                                        <Icon as={FaCalendarAlt} mr={2} />
                                        Timeline
                                    </Tab>
                                </TabList>

                                <TabPanels flex="1" overflow="auto">
                                    <TabPanel height="100%" px={2} py={4}>
                                        <Box height="100%">
                                            <Heading size="sm" mb={4}>
                                                Crime Types Frequency
                                            </Heading>
                                            {chartData.barChartData.length > 0 ? (
                                                <CrimeBarChart data={chartData.barChartData} />
                                            ) : (
                                                <Flex justify="center" align="center" height="100%">
                                                    <Text>No data available</Text>
                                                </Flex>
                                            )}
                                        </Box>
                                    </TabPanel>
                                    <TabPanel height="100%" px={2} py={4}>
                                        <Box height="100%">
                                            <Heading size="sm" mb={4}>
                                                Crime Timeline
                                            </Heading>
                                            {chartData.timelineData.length > 0 ? (
                                                <CrimeTimelineChart data={chartData.timelineData} />
                                            ) : (
                                                <Flex justify="center" align="center" height="100%">
                                                    <Text>No data available</Text>
                                                </Flex>
                                            )}
                                        </Box>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </Flex>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default MapView;
