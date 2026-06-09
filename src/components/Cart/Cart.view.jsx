// src/components/Cart.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { cartAtom } from '../../states/cart.states';
import { createSale } from '../../apis/sale';
import { toaster } from '../ui/toaster';

const QuantityControl = ({ quantity, onDecrement, onIncrement }) => (
  <HStack>
    <Button size='sm' onClick={onDecrement} disabled={quantity === 0}>
      -
    </Button>
    <Text>{quantity}</Text>
    <Button size='sm' onClick={onIncrement}>
      +
    </Button>
  </HStack>
);

const CartItem = ({ product, onChangeQuantity }) => {
  const handleIncrement = () =>
    onChangeQuantity(product.id, product.quantity + 1);
  const handleDecrement = () =>
    onChangeQuantity(product.id, Math.max(product.quantity - 1, 0));

  return (
    <Flex
      justify='space-between'
      align='center'
      borderWidth='1px'
      borderRadius='lg'
      p={4}
      w='100%'>
      <Text fontWeight='bold'>{product.name}</Text>
      <QuantityControl
        quantity={product.quantity}
        onDecrement={handleDecrement}
        onIncrement={handleIncrement}
      />
    </Flex>
  );
};

export const Cart = ({ onSaleComplete }) => {
  const [products, setProducts] = useAtom(cartAtom);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
  };

  const total = products.reduce((sum, p) => sum + p.quantity, 0);

  const handleSubmit = async () => {
    if (products.length === 0) return;

    setLoading(true);

    try {
      const results = await Promise.allSettled(
        products
          .filter((product) => product.quantity > 0)
          .map(async (product) => {
            try {
              await createSale({
                product_id: product.id,
                quantity: product.quantity,
              });
              return { status: 'success', product };
            } catch (err) {
              const backendMessage =
                err?.response?.data?.message ||
                'Erro desconhecido ao criar venda';
              return { status: 'error', product, message: backendMessage };
            }
          })
      );

      let hasError = false;

      results.forEach((result) => {
        if (result.value?.status === 'success') {
          toaster.success({
            title: 'Venda concluída',
            description: `O produto ${result.value.product.name} foi vendido com sucesso!`,
          });
          setProducts((prev) =>
            prev.filter((p) => p.id !== result.value.product.id)
          );
        } else if (result.value?.status === 'error') {
          hasError = true;
          if (result.value.message.includes('Insufficient quantity')) {
            toaster.error({
              title: 'Erro ao criar venda',
              description: `Produto ${result.value.product.name} não possui quantidade suficiente em estoque.`,
            });
          } else {
            toaster.error({
              title: 'Erro ao criar venda',
              description: `Erro ao criar venda do produto ${
                result.value.product?.name || 'desconhecido'
              }`,
            });
          }
        }
      });

      if (!hasError) {
        toaster.success({
          title: 'Compra finalizada',
          description: 'Sua compra foi realizada com sucesso!',
        });
        setProducts([]);
        onSaleComplete?.();
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading size='md' mb={4}>
        Seu Carrinho
      </Heading>
      <VStack spacing={4} align='stretch'>
        {products.map((product) => (
          <CartItem
            key={product.id}
            product={product}
            onChangeQuantity={handleQuantityChange}
          />
        ))}
      </VStack>
      <Flex justify='space-between' fontWeight='bold'>
        <Text>Total de Itens:</Text>
        <Text>{total}</Text>
      </Flex>
      <Button
        mt={4}
        colorScheme='blue'
        w='full'
        onClick={handleSubmit}
        disabled={products.length === 0 || loading}>
        {loading ? 'Finalizando compra...' : 'Finalizar Compra'}
      </Button>
    </Box>
  );
};
