import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
  Field,
} from '@chakra-ui/react';
import { loginSeller, isAuthenticated, setToken } from '../../apis/login';
import { Link, useNavigate } from 'react-router';
import { toaster } from '../../components/ui/toaster';
import logo from '../../assets/logo_editada.png';
import Loading from '../../components/Loading';

export const SignInView = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = 'E-mail é obrigatório';
    }
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data = await loginSeller({ ...formData });
      setToken(data.access_token);
      toaster.success({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!',
      });
      navigate('/dashboard');
    } catch (err) {
      toaster.error({
        title: 'Erro ao realizar login',
        description:
          err?.response?.data?.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message='Realizando login...' />;
  }

  return (
    <Box
      minH='100vh'
      bgGradient='linear(to-b, blue.50, white)'
      display='flex'
      alignItems='center'
      justifyContent='center'
      p={4}>
      <Box bg='white' p={10} rounded='lg' boxShadow='xl' maxW='md' w='100%'>
        <Center mb={8} flexDirection='column' gap={3}>
          <Flex align='center' gap={3}>
            <img
              src={logo}
              alt='Logo StockPro'
              style={{ width: 250, height: 80 }}
            />
            {/* <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              StockPro
            </Text> */}
          </Flex>
        </Center>

        <Heading mb={2} fontSize='2xl' textAlign='center' color='gray.700'>
          Fazer Login
        </Heading>
        <Text mb={6} fontSize='sm' color='gray.500' textAlign='center'>
          Entre na sua conta para gerenciar seu mercado
        </Text>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}>
          <Stack spacing={4}>
            {/* Campo Email */}
            <Field.Root invalid={Boolean(errors.email)}>
              <Field.Label>Email</Field.Label>
              <Input
                type='email'
                placeholder='seu@email.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                focusBorderColor='blue.500'
              />
              {errors.email && (
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Campo Senha */}
            <Field.Root invalid={Boolean(errors.password)}>
              <Field.Label>Senha</Field.Label>
              <Input
                type='password'
                placeholder='******'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                focusBorderColor='blue.500'
              />
              {errors.password && (
                <Field.ErrorText>{errors.password}</Field.ErrorText>
              )}
            </Field.Root>

            <Button
              type='submit'
              colorScheme='blue'
              disabled={isLoading}
              size='lg'
              fontWeight='bold'
              borderRadius='md'>
              Entrar
            </Button>

            <Center fontSize='sm' color='gray.600'>
              Não tem uma conta?{' '}
              <ChakraLink
                as={Link}
                to='/seller/register'
                color='blue.500'
                fontWeight='semibold'
                ml={1}
                _hover={{ textDecoration: 'underline' }}>
                Cadastre-se
              </ChakraLink>
            </Center>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};
