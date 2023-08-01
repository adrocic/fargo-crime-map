import { QueryClient, QueryClientProvider } from "react-query";
import JustData from "Views/JustData";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <JustData />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
