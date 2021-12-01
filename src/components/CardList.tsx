import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
    title: string;
    description: string;
    url: string;
    ts: number;
    id: string;
}

interface CardsProps {
    cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
    const modal = useDisclosure();
    const [openImage, setOpenImage] = useState('');

    function handleViewImage(imageUrl): void {
        setOpenImage(imageUrl);
        modal.onOpen();
    }

    return (
        <>
            <SimpleGrid
                flex="1"
                gap="4"
                minChildWidth="293px"
                align="flex-start"
            >
                {cards.map(card => {
                    return (
                        <Card
                            key={card.id}
                            data={card}
                            viewImage={() => handleViewImage(card.url)}
                        />
                    );
                })}
            </SimpleGrid>

            <ModalViewImage
                isOpen={modal.isOpen}
                onClose={modal.onClose}
                imgUrl={openImage}
            />
        </>
    );
}
