import { QueryClient, QueryClientProvider } from "react-query";
import JustData from "Views/HomeView";
import { baseTheme, ChakraProvider } from "@chakra-ui/react";

const App = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={baseTheme}>
                <JustData />
            </ChakraProvider>
        </QueryClientProvider>
    );
};

export default App;
