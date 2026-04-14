'use client';

import logo from '../../assets/logo_editada.png';
import React, { useState } from 'react';
import { useColorModeValue } from '../ui/color-mode';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Flex,
  Portal,
  CloseButton,
  Drawer,
  Separator,
} from '@chakra-ui/react';
import {
  AiOutlineShoppingCart,
  AiOutlineLogout,
  AiOutlineProduct,
} from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { TbTableDashed } from 'react-icons/tb';

const navItems = [
  { label: 'Gerenciamento', icon: TbTableDashed, key: 'dashboard' },
  { label: 'Produtos', icon: AiOutlineProduct, key: 'products/new' }, //TODO: Alterar a key para 'products' pra exibição da listagem posteriormente
  // { label: 'Vendas', icon: AiOutlineShoppingCart, key: 'sales' },
];
export const Layout = ({ activeKey = 'dashboard', children }) => {
  const bg = useColorModeValue('white', 'gray.900');
  const activeBg = useColorModeValue('blue.100', 'blue.700');
  const activeColor = useColorModeValue('blue.600', 'blue.300');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box display='flex' minH='100vh'>
      {/* Sidebar */}
      <Box
        as='nav'
        position='fixed'
        left={0}
        top={0}
        h='100vh'
        w='260px'
        bg={bg}
        shadow='md'
        p={6}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'>
        <img
          src={logo}
          style={{ width: '100px', objectFit: 'contain', height: '40px' }}
        />

        <Separator />

        {/* Navegação */}
        <VStack spacing={4} align='stretch' flex='1'>
          {navItems.map(({ label, icon, key }) => {
            const isActive = activeKey === key;
            return (
              <Flex
                key={key}
                align='center'
                p={3}
                borderRadius='md'
                cursor='pointer'
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : 'inherit'}
                _hover={{
                  bg: isActive ? activeBg : 'gray.100',
                }}
                onClick={() => navigate(`/${key}`)}>
                <Icon as={icon} boxSize={5} mr={3} />
                <Text fontWeight={isActive ? 'semibold' : 'normal'}>
                  {label}
                </Text>
              </Flex>
            );
          })}
        </VStack>

        {/* Área do Usuário */}
        <Box>
          <Button
            leftIcon={<AiOutlineLogout />}
            size='sm'
            colorScheme='red'
            variant='ghost'
            w='full'
            justifyContent='flex-start'
            onClick={handleLogout}>
            Sair
          </Button>
        </Box>
      </Box>

      {/* Conteúdo Principal */}
      <Box flex='1' ml='260px' bg='gray.50' p={6}>
        {children}
      </Box>
    </Box>
  );
};
