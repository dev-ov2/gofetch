import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import mainReducer from "../store/reducer";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import * as ReactQuery from "react-query";

// Helper function to intialize a test store.

/**
 * Helper function to initialize a test store.
 * @param state :: the state to run tests against.
 * @returns the newly created EnhancedStore
 */
export const createTestStore = (state: RootState): EnhancedStore =>
  configureStore({
    reducer: {
      main: mainReducer,
    },
    preloadedState: state,
  });

export const createTestQueryClient = () => new QueryClient();

/**
 * Wraps components within a provider configuration.
 * @param store :: the EnhancedStore (normally generated from createTestStore)
 *              :: to run tests against
 * @param children :: the components we will test
 * @returns The wrapped component with properly instantiated providers
 */
export const withProviders = (store: EnhancedStore, children: any) => (
  <QueryClientProvider client={createTestQueryClient()}>
    <Provider store={store}>{children}</Provider>
  </QueryClientProvider>
);

/**
 * Mocks a request of useQuery used in components
 * @param data :: the data to mock
 */
export const mockUseQuery = (data: any) => {
  jest
    .spyOn(ReactQuery, "useQuery")
    .mockImplementation(
      jest.fn().mockReturnValue({ data, isLoading: false, isSuccess: true })
    );
};
