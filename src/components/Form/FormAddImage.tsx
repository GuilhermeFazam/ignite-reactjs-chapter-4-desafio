import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
    closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
    const [imageUrl, setImageUrl] = useState('');
    const [localImageUrl, setLocalImageUrl] = useState('');
    const toast = useToast();
    const formValidations = {
        image: {
            required: {
                value: true,
                message: 'Título obrigatório',
            },
            validate: {
                lessThan10MB: value => {
                    const imageSize = value[0].size / 1000;
                    const imageMaxSize = 1000 * 10;
                    return (
                        imageMaxSize > imageSize ||
                        'O arquivo deve ser menor que 10MB'
                    );
                },
                acceptedFormats: value => {
                    const fileType = value[0].type;
                    const regex = new RegExp(/.(gif|jpeg|png)$/i);
                    return (
                        regex.test(fileType) ||
                        'Somente são aceitos arquivos PNG, JPEG e GIF'
                    );
                },
            },
        },
        title: {
            required: {
                value: true,
                message: 'Título obrigatório',
            },
            minLength: {
                value: 2,
                message: 'Mínimo de 2 caracteres',
            },
            maxLength: {
                value: 20,
                message: 'Máximo de 20 caracteres',
            },
        },
        description: {
            required: {
                value: true,
                message: 'Descrição obrigatória',
            },
            maxLength: {
                value: 65,
                message: 'Máximo de 65 caracteres',
            },
        },
    };

    const queryClient = useQueryClient();
    const mutation = useMutation(
        async () => {
            const response = await api.get('api/images');
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('images');
            },
        }
    );
    const { register, handleSubmit, reset, formState, setError, trigger } =
        useForm();
    const { errors } = formState;
    const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
        try {
            if (!imageUrl) {
                toast({
                    title: 'Falha no envio',
                    description:
                        'Ocorreu um erro ao realizar o upload da sua imagem.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            await api.post('api/images', {
                title: data.title,
                description: data.description,
                url: imageUrl,
            });
            await mutation.mutateAsync();
            toast({
                title: 'Sucesso',
                description: 'Imagem Salva com sucesso',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch {
            toast({
                title: 'Falha no envio',
                description:
                    'Ocorreu um erro ao realizar o upload da sua imagem.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            reset();
            closeModal();
        }
    };

    return (
        <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <FileInput
                    setImageUrl={setImageUrl}
                    localImageUrl={localImageUrl}
                    setLocalImageUrl={setLocalImageUrl}
                    setError={setError}
                    trigger={trigger}
                    name="image"
                    error={errors.image}
                    {...register('image', formValidations.image)}
                />
                <TextInput
                    placeholder="Título da imagem..."
                    name="title"
                    error={errors.title}
                    {...register('title', formValidations.title)}
                />
                <TextInput
                    placeholder="Descrição da imagem..."
                    name="description"
                    error={errors.description}
                    {...register('description', formValidations.description)}
                />
            </Stack>
            <Button
                my={6}
                isLoading={formState.isSubmitting}
                isDisabled={formState.isSubmitting}
                type="submit"
                w="100%"
                py={6}
            >
                Enviar
            </Button>
        </Box>
    );
}
