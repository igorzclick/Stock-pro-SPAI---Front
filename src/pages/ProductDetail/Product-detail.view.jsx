'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Badge,
  Stack,
  Separator,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router';
import { getProduct } from '../../apis/products';
import Loading from '../../components/Loading';
import { IoArrowBack } from 'react-icons/io5';

export const ProductDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data.product);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loading message='Carregando produto...' />;

  if (!product) {
    return (
      <Box p={8} textAlign='center'>
        <Text color='gray.500'>Produto não encontrado 😢</Text>
        <Button mt={4} colorScheme='blue' onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>
    );
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'green';
      case 'inativo':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={6}>
      {/* Cabeçalho */}
      <Flex justify='space-between' align='center' mb={6}>
        <Heading size='lg' color={'gray.700'}>
          Detalhes do Produto
        </Heading>
        <Button
          leftIcon={<IoArrowBack />}
          variant='outline'
          colorScheme='blue'
          onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Flex>

      {/* Card do Produto */}
      <Flex
        bg='white'
        p={6}
        borderRadius='md'
        shadow='sm'
        borderWidth='1px'
        borderColor={'gray.300'}
        direction={{ base: 'column', md: 'row' }}
        gap={8}>
        {/* Imagem */}
        <Box
          flex='1'
          display='flex'
          alignItems='center'
          justifyContent='center'>
          {product.img ? (
            <Image
              src={product.img}
              alt={product.name}
              borderRadius='md'
              boxSize={{ base: '250px', md: '300px' }}
              objectFit='contain'
              shadow='md'
            />
          ) : (
            <Text>Não há imagem</Text>
          )}
        </Box>

        {/* Informações */}
        <Box flex='2'>
          <Heading size='md' mb={2}>
            {product.name}
          </Heading>
          <Badge
            colorScheme={getStatusColor(product.status)}
            fontSize='0.8em'
            mb={4}>
            {product.status}
          </Badge>

          <Separator mb={4} />

          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            <Box>
              <Text fontSize='sm' color='gray.500'>
                Código do Produto
              </Text>
              <Text fontWeight='medium'>{product.id}</Text>
            </Box>

            <Box>
              <Text fontSize='sm' color='gray.500'>
                Vendedor
              </Text>
              <Text fontWeight='medium'>{product.seller_id || 'N/A'}</Text>
            </Box>

            <Box>
              <Text fontSize='sm' color='gray.500'>
                Preço
              </Text>
              <Text fontWeight='semibold' color='green.500'>
                {formatCurrency(product.price)}
              </Text>
            </Box>

            <Box>
              <Text fontSize='sm' color='gray.500'>
                Quantidade em Estoque
              </Text>
              <Text fontWeight='medium'>{product.quantity}</Text>
            </Box>
          </SimpleGrid>

          <Separator my={6} />

          <Stack direction='row' spacing={4}>
            <Button
              colorScheme='blue'
              disabled
              onClick={() => navigate(`/products/edit/${product.id}`)}>
              Editar Produto
            </Button>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
