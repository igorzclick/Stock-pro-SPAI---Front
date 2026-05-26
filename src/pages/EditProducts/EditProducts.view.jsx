import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Field,
  Image,
  Stack,
  Center,
} from '@chakra-ui/react';
import { toaster } from '../../components/ui/toaster';
import { getProduct, updateProduct } from '../../apis/products';
import Loading from '../../components/Loading';

export const EditProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data.product);
      })
      .catch((err) => toaster.error(err?.response?.data?.message))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'price' || name === 'quantity') {
      setProduct((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!product.name || product.name.trim() === '') {
      errors.name = 'Nome do produto é obrigatório';
    }

    if (!product.price || product.price <= 0) {
      errors.price = 'Preço deve ser maior que zero';
    }

    if (!product.quantity || product.quantity < 0) {
      errors.quantity = 'Quantidade deve ser um número não negativo';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    updateProduct(id, {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      img: product.img,
      status: product.status,
    })
      .then(() => {
        toaster.success({
          title: 'Produto atualizado',
          description: 'As alterações foram salvas com sucesso',
        });
        navigate('/products');
      })
      .catch((err) => {
        toaster.error({
          title: 'Erro ao atualizar produto',
          description:
            err?.response?.data?.message || 'Tente novamente mais tarde',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (loadingData) {
    return <Loading message='Carregando produto...' />;
  }

  if (!product) {
    return (
      <Box p={8} textAlign='center' bg='white' rounded='md' shadow='md'>
        <Text mb={4}>Produto não encontrado.</Text>
        <Button onClick={() => navigate('/products')}>
          Voltar para Produtos
        </Button>
      </Box>
    );
  }

  return (
    <Center h='100vh' w='100%'>
      <Box p={6} bg='white' rounded='md' shadow='md' maxW='600px' w='100%'>
        <Flex justify='space-between' align='center' mb={6}>
          <Box>
            <Heading size='lg' mb={1}>
              Editar Produto
            </Heading>
            <Text color='gray.500' fontSize='sm'>
              ID: {product.id}
            </Text>
          </Box>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Field.Root invalid={!!errors.name}>
              <Field.Label>Nome do Produto</Field.Label>
              <Input
                name='name'
                value={product.name}
                onChange={handleChange}
                placeholder='Digite o nome'
              />
              {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
            </Field.Root>

            <Field.Root invalid={!!errors.price}>
              <Field.Label>Preço</Field.Label>
              <Input
                type='number'
                step='0.01'
                name='price'
                value={product.price}
                onChange={handleChange}
                placeholder='Ex: 99.90'
                min='0'
              />
              {errors.price && (
                <Field.ErrorText>{errors.price}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.quantity}>
              <Field.Label>Quantidade</Field.Label>
              <Input
                type='number'
                name='quantity'
                value={product.quantity}
                onChange={handleChange}
                placeholder='Ex: 10'
                min='0'
              />
              {errors.quantity && (
                <Field.ErrorText>{errors.quantity}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.image}>
              <Field.Label>Imagem (URL)</Field.Label>
              <Input
                name='img'
                value={product.img}
                onChange={handleChange}
                placeholder='Cole o link da imagem'
              />
              {product.img && (
                <Image
                  src={product.img}
                  alt={product.img}
                  boxSize='150px'
                  mt={2}
                  objectFit='cover'
                  borderRadius='md'
                />
              )}
              {errors.image && (
                <Field.ErrorText>{errors.image}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root>
              <Field.Label>Status</Field.Label>
              <select
                name='status'
                value={product.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                }}>
                <option value='ativo'>Ativo</option>
                <option value='inativo'>Inativo</option>
              </select>
            </Field.Root>

            <Button
              type='submit'
              colorScheme='blue'
              isLoading={isLoading}
              disabled={isLoading}>
              Salvar Alterações
            </Button>
            <Button
              variant='outline'
              onClick={() => navigate('/products')}
              disabled={isLoading}>
              Cancelar
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};
