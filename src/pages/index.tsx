import { Box, Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';

export default function Home(): JSX.Element {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery(
        'images',
        ({ pageParam = null }): Promise<any> =>
            api.get('api/images', { params: { after: pageParam } }),
        {
            getNextPageParam: (lastPage, pages) => lastPage.data.after,
        }
    );

    const formattedData = useMemo(() => {
        const newArray = [];
        data?.pages.map(page => {
            return page.data.data.map(item => {
                return newArray.push({
                    title: item.title,
                    description: item.description,
                    url: item.url,
                    ts: item.ts,
                    id: item.id,
                });
            });
        });
        return newArray;
    }, [data]);
    async function handleNewImages(): Promise<void> {
        const teste = await fetchNextPage();
        console.log(teste);
        console.log(formattedData);
    }
    if (isFetching) {
        return (
            <>
                <Header />
                <Loading />
            </>
        );
    }

    if (error || status === 'error') {
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
