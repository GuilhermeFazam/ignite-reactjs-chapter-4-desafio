import { Box, Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';

export default function Home(): JSX.Element {
    const fetchImages = ({ pageParam = null }): Promise<any> =>
        api.get('api/images', { params: { after: pageParam } });
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        isFetchingNextPage,
    } = useInfiniteQuery('images', fetchImages, {
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.data.after) {
                return lastPage.data.after;
            }
            return null;
        },
    });
    const formattedData = useMemo(() => {
        const newData = data?.pages.map(page => {
            return page.data.data;
        });
        return newData?.flat();
    }, [data]);

    async function handleNewImages(): Promise<void> {
        if (hasNextPage) {
            await fetchNextPage();
        }
    }
    if (isLoading) {
        return (
            <>
                <Header />
                <Loading />
            </>
        );
    }
    if (isError) {
        return (
            <>
                <Header />
                <Error />
            </>
        );
    }
    return (
        <>
            <Header />
            <Box maxW={1120} px={20} mx="auto" my={20}>
                <CardList cards={formattedData} />
                {hasNextPage && (
                    <Button
                        onClick={() => handleNewImages()}
                        isLoading={isFetchingNextPage}
                    >
                        Carregar mais
                    </Button>
                )}
            </Box>
        </>
    );
}
