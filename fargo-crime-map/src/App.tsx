import { QueryClient, QueryClientProvider } from "react-query";
import JustData from "Views/JustData";
import { ChakraProvider } from "@chakra-ui/react";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <JustData />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
