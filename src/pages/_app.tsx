import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { theme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    const queryClient = new QueryClient();

    return (
        <ChakraProvider resetCSS theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
                <ReactQueryDevtools />
            </QueryClientProvider>
        </ChakraProvider>
    );
}

export default MyApp;
