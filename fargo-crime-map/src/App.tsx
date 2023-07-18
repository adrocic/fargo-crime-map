import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import CrimeDataComponent from "Components/ScrapingComponent/crimeDataComponent";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <CrimeDataComponent />
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </QueryClientProvider>
  );
}

export default App;
