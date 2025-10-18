import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateRouteModal from "./components/domain/CreateRouteModal";
import RouteDetailsModal from "./components/domain/RouteDetailsModal";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from "./routes";
import { useUIStore } from "./store/useUIStore";

// Criar cliente do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const {
    isCreateRouteModalOpen,
    closeCreateRouteModal,
    isRouteDetailsModalOpen,
    closeRouteDetailsModal,
    selectedRoute,
  } = useUIStore();

  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
      <CreateRouteModal
        isOpen={isCreateRouteModalOpen}
        onClose={closeCreateRouteModal}
      />
      <RouteDetailsModal
        isOpen={isRouteDetailsModalOpen}
        onClose={closeRouteDetailsModal}
        route={selectedRoute}
      />
    </QueryClientProvider>
  );
}

export default App;
