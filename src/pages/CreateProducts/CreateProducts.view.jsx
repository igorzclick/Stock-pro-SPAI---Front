import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Card,
  Input,
  Stack,
  Center,
  Field,
  Text,
  Heading,
  Image,
  Flex,
} from '@chakra-ui/react';
import { NativeSelect } from '@chakra-ui/react';
import { toaster } from '../../components/ui/toaster';
import logo from '../../assets/logo_editada.png';
import { createProduct } from '../../apis/products';

export const CreateProductView = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    image: '',
    status: 'ativo',
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Preço deve ser um número positivo';
    if (!formData.quantity || parseInt(formData.quantity) <= 0)
      newErrors.quantity = 'Quantidade deve ser um número inteiro positivo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    createProduct({
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      img: formData.image,
    })
      .then(() => {
        toaster.success({
          title: 'Produto criado com sucesso',
          description: 'O produto foi adicionado ao sistema',
        });
        navigate('/products');
      })
      .catch((err) => {
        toaster.error({
          title: 'Erro ao criar produto',
          description:
            err.response?.data?.message ||
            'Ocorreu um erro ao tentar criar o produto',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <Center w='100%' h='100vh' py='10'>
      <Card.Root width='520px'>
        <form onSubmit={handleSubmit}>
          <Card.Body gap='2'>
            <Center w='100%'>
              <img
                src={logo}
                alt='Logo'
                style={{ width: '100px', objectFit: 'cover', height: '40px' }}
              />
            </Center>

            <Card.Title>Novo Produto</Card.Title>
            <Card.Description>
              Preencha os dados para cadastrar um novo produto
            </Card.Description>

            <Stack gap='2'>
              {/* Nome */}
              <Field.Root invalid={!!errors.name}>
                <Field.Label>Nome do Produto</Field.Label>
                <Input
                  placeholder='Digite o nome do produto'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <Field.ErrorText>{errors.name}</Field.ErrorText>
                )}
              </Field.Root>

              {/* Preço */}
              <Field.Root invalid={!!errors.price}>
                <Field.Label>Preço</Field.Label>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='Digite o preço (Ex: 99.90)'
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
                {errors.price && (
                  <Field.ErrorText>{errors.price}</Field.ErrorText>
                )}
              </Field.Root>

              {/* Quantidade */}
              <Field.Root invalid={!!errors.quantity}>
                <Field.Label>Quantidade</Field.Label>
                <Input
                  type='number'
                  placeholder='Digite a quantidade'
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                {errors.quantity && (
                  <Field.ErrorText>{errors.quantity}</Field.ErrorText>
                )}
              </Field.Root>

              {/* Imagem */}
              <Field.Root>
                <Field.Label>Imagem (URL)</Field.Label>
                <Input
                  placeholder='Cole o link da imagem'
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
                {formData.image && (
                  <Image
                    src={formData.image}
                    alt={formData.name}
                    boxSize='120px'
                    mt={2}
                    objectFit='cover'
                    borderRadius='md'
                  />
                )}
              </Field.Root>

              {/* Status com NativeSelect */}
              <Field.Root>
                <Field.Label>Status</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }>
                    <option value='ativo'>Ativo</option>
                    <option value='inativo'>Inativo</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </Stack>
          </Card.Body>

          <Card.Footer flex flexDirection={'column'} gap='2'>
            <Button
              type='submit'
              width={'100%'}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme='blue'>
              Cadastrar Produto
            </Button>
            <Button variant='outline' onClick={handleCancel} width={'100%'}>
              Cancelar
            </Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </Center>
  );
};
