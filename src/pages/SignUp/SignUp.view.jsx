import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo_editada.png';
import {
  Avatar,
  Button,
  Card,
  Input,
  Stack,
  Center,
  Toast,
  Field,
  Text,
} from '@chakra-ui/react';
import { isAuthenticated } from '../../apis/login';
import { Link, useNavigate } from 'react-router';
import { toaster } from '../../components/ui/toaster';
import { Link as ChakraLink } from '@chakra-ui/react';
import { registerSeller } from '../../apis/registerSeller';
import Loading from '../../components/Loading';

export const SignUpView = () => {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    cellphone: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    cnpj: '',
    cellphone: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/seller/register');
    }
  }, [navigate]);

  const validateForm = () => {
    let errors = {};
    if (!formData.name) {
      errors.name = 'Nome é obrigatório';
    }
    if (!formData.cnpj) {
      errors.cnpj = 'CNPJ é obrigatório';
    }
    if (!formData.cellphone) {
      errors.cellphone = 'Celular é obrigatório';
    }
    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = 'As senhas não coincidem';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      await registerSeller({
        name: formData.name,
        cnpj: formData.cnpj,
        cellphone: formData.cellphone,
        email: formData.email,
        password: formData.password,
      });

      toaster.success({
        title: 'Cadastro realizado com sucesso',
        description: 'Bem-vindo ao Think Fast!',
      });
      navigate('/dashboard');
    } catch (err) {
      toaster.error({
        title: 'Erro ao realizar cadastro',
        description:
          err?.response?.data?.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <Loading message='Realizando cadastro...' />;
  }

  return (
    <Center w='100%' h='100vh' my='10'>
      <Card.Root width='520px'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}>
          <Card.Body gap='2'>
            <Center w='100%'>
              <img
                src={logo}
                style={{ width: '100px', objectFit: 'cover', height: '40px' }}
              />
            </Center>

            <Card.Title>Cadastro de usuário</Card.Title>
            <Card.Description>
              Crie sua conta e comece a jogar!
            </Card.Description>

            <Stack gap='2'>
              <Field.Root invalid={!!errors.name}>
                <Field.Label>Nome</Field.Label>
                <Input
                  placeholder='Insira seu nome'
                  onChange={(e) => {
                    setErrors({ ...errors, name: '' });
                    setFormData({ ...formData, name: e.target.value });
                  }}
                />
                {errors.nickname && (
                  <Field.ErrorText>{errors.nickname}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.cnpj}>
                {' '}
                <Field.Label>CNPJ</Field.Label>
                <Input
                  placeholder='Insira seu CNPJ'
                  onChange={(e) => {
                    setErrors({ ...errors, cnpj: '' });
                    setFormData({ ...formData, cnpj: e.target.value });
                  }}
                />
              </Field.Root>
              <Field.Root invalid={!!errors.cellphone}>
                <Field.Label>Celular</Field.Label>
                <Input
                  placeholder='Insira seu celular'
                  onChange={(e) => {
                    setErrors({ ...errors, cellphone: '' });
                    setFormData({ ...formData, cellphone: e.target.value });
                  }}
                />
                {errors.cellphone && (
                  <Field.ErrorText>{errors.cellphone}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.email} colorPalette={'purple'}>
                <Field.Label>Email</Field.Label>
                <Input
                  placeholder='Insira seu email'
                  onChange={(e) => {
                    setErrors({ ...errors, email: '' });
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
                {errors.email && (
                  <Field.ErrorText>{errors.email}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Senha</Field.Label>
                <Input
                  placeholder='Insira sua senha'
                  type='password'
                  onChange={(e) => {
                    setErrors({ ...errors, password: '' });
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
                {errors.password && (
                  <Field.ErrorText>{errors.password}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.passwordConfirm}>
                <Field.Label>Confirmar Senha</Field.Label>
                <Input
                  placeholder='Confirme sua senha'
                  type='password'
                  onChange={(e) => {
                    setErrors({ ...errors, passwordConfirm: '' });
                    setFormData({
                      ...formData,
                      passwordConfirm: e.target.value,
                    });
                  }}
                />
                {errors.passwordConfirm && (
                  <Field.ErrorText>{errors.passwordConfirm}</Field.ErrorText>
                )}
              </Field.Root>
            </Stack>

            <Text>
              Ja possui uma conta?{' '}
              <ChakraLink asChild>
                <Link to='/auth/login'>Entrar</Link>
              </ChakraLink>
            </Text>
          </Card.Body>

          <Card.Footer flex flexDirection={'column'} gap='2'>
            <Button type='submit' width={'100%'} disabled={isLoading}>
              Cadastrar
            </Button>
            <Button variant='outline' onClick={handleCancel} width={'100%'}>
              Voltar
            </Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </Center>
  );
};
