'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Input,
  HStack,
  IconButton,
  Image,
  Table,
  InputGroup,
  Dialog,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { FaCartPlus } from 'react-icons/fa';
import { deleteProduct, getProducts } from '../../apis/products';
import { toaster } from '../../components/ui/toaster';
import Loading from '../../components/Loading';
import { useAtom } from 'jotai';
// import { cartAtom } from '../../states/cart.states';

export const ListProductsview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  // const [cartAtomState, setCartAtomState] = useAtom(cartAtom);

  // estado do modal
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => {
        setProducts(data.products);
      })
      .catch(() => {
        toaster.error({
          title: 'Erro ao buscar produtos',
          description: 'Ocorreu um erro ao buscar os produtos',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // const handleAddProductToCart = (product) => {
  //   const existingProduct = cartAtomState.find(
  //     (item) => item.id === product.id
  //   );
  //   if (existingProduct) {
  //     setCartAtomState((prev) =>
  //       prev.map((item) =>
  //         item.id === product.id
  //           ? { ...item, quantity: item.quantity + 1 }
  //           : item
  //       )
  //     );
  //     return;
  //   }
  //   setCartAtomState((prev) => [
  //     ...prev,
  //     { id: product.id, quantity: 1, name: product.name },
  //   ]);
  // };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      setLoadingDelete(true);
      deleteProduct(selectedProduct.id)
        .then(() => {
          toaster.success({
            title: 'Produto excluído',
            description: `${selectedProduct.name} foi removido com sucesso.`,
          });
          setProducts((prev) =>
            prev.filter((p) => p.id !== selectedProduct.id)
          );
          setOpenDelete(false);
          setSelectedProduct(null);
        })
        .catch((err) => {
          toaster.error({
            title: 'Erro ao excluir produto',
            description:
              err?.response?.data?.message || 'Tente novamente mais tarde',
          });
        })
        .finally(() => {
          setLoadingDelete(false);
        });
    }
  };

  const filteredProducts = searchTerm
    ? products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : products;

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

  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p) => p.status?.toLowerCase() === 'ativo'
  ).length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

  if (loading) {
    return <Loading message='Buscando produtos...' />;
  }

  return (
    <Box p={6} bg='white' rounded='md' shadow='md'>
      {/* Header */}
      <Flex justify='space-between' align='center' mb={6}>
        <Box>
          <Heading size='lg' fontWeight='bold' mb={2}>
            Produtos
          </Heading>
          <Text color='gray.500' fontSize='sm'>
            Gerencie seus produtos e estoque
          </Text>
        </Box>
        <Button
          size='sm'
          colorScheme='blue'
          leftIcon={<FiPlus />}
          onClick={() => navigate('/products/new')}>
          Novo Produto
        </Button>
      </Flex>

      {/* Cards de resumo */}
      <Flex gap={6} wrap='wrap' mb={6}>
        <Box
          flex='1'
          minW='200px'
          borderWidth='1px'
          borderRadius='md'
          p={4}
          bg='blue.50'>
          <Text fontSize='sm' color='gray.600' mb={1}>
            Total de Produtos
          </Text>
          <Text fontSize='2xl' fontWeight='bold' color='blue.600'>
            {totalProducts}
          </Text>
        </Box>
        <Box
          flex='1'
          minW='200px'
          borderWidth='1px'
          borderRadius='md'
          p={4}
          bg='green.50'>
          <Text fontSize='sm' color='gray.600' mb={1}>
            Produtos Ativos
          </Text>
          <Text fontSize='2xl' fontWeight='bold' color='green.600'>
            {activeProducts}
          </Text>
        </Box>
        <Box
          flex='1'
          minW='200px'
          borderWidth='1px'
          borderRadius='md'
          p={4}
          bg='purple.50'>
          <Text fontSize='sm' color='gray.600' mb={1}>
            Total em Estoque
          </Text>
          <Text fontSize='2xl' fontWeight='bold' color='purple.600'>
            {totalStock}
          </Text>
        </Box>
      </Flex>

      {/* Busca */}
      <Flex justify='space-between' align='center' mb={4} wrap='wrap' gap={4}>
        <HStack spacing={2} maxW='400px' flex='1'>
          <InputGroup startElement={<FiSearch />}>
            <Input
              placeholder='Buscar por nome do produto'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              flex='1'
            />
          </InputGroup>
        </HStack>
      </Flex>

      {/* Tabela */}
      <Table.Root
        size='md'
        borderWidth='1px'
        borderRadius='md'
        overflow='hidden'>
        <Table.Header bg='gray.50'>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Imagem</Table.ColumnHeader>
            <Table.ColumnHeader>Produto</Table.ColumnHeader>
            <Table.ColumnHeader>Preço</Table.ColumnHeader>
            <Table.ColumnHeader>Quantidade</Table.ColumnHeader>
            <Table.ColumnHeader>Vendedor</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='center'>Ações</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredProducts.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={8} textAlign='center' py={8}>
                <Text color='gray.500'>Nenhum produto encontrado</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            filteredProducts.map((p) => (
              <Table.Row key={p.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell fontWeight='semibold'>{p.id}</Table.Cell>
                <Table.Cell>
                  {p.img ? (
                    <Image
                      src={p.img}
                      alt={p.name}
                      boxSize='50px'
                      objectFit='cover'
                      borderRadius='md'
                    />
                  ) : (
                    <Text>Não há imagem</Text>
                  )}
                </Table.Cell>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>{formatCurrency(p.price)}</Table.Cell>
                <Table.Cell>{p.quantity}</Table.Cell>
                <Table.Cell>{p.seller_id}</Table.Cell>
                <Table.Cell>
                  <Badge colorScheme={getStatusColor(p.status)}>
                    {p.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  <HStack spacing={2} justify='center'>
                    <IconButton
                      size='sm'
                      variant='ghost'
                      aria-label='Ver detalhes'
                      color='gray.600'
                      onClick={() => navigate(`/product/detail/${p.id}`)}>
                      <FiEye />
                    </IconButton>
                    {/* <IconButton
                      size='sm'
                      variant='ghost'
                      aria-label='Editar'
                      color='blue.600'
                      onClick={() => navigate(`/products/edit/${p.id}`)}>
                      <FiEdit />
                    </IconButton> */}
                    {/* <IconButton
                      size='sm'
                      variant='ghost'
                      aria-label='Adicionar ao carrinho'
                      color='blue.600'
                      onClick={() => handleAddProductToCart(p)}>
                      <FaCartPlus />
                    </IconButton> */}
                    {/* <IconButton
                      size='sm'
                      variant='ghost'
                      aria-label='Excluir'
                      color='red.600'
                      onClick={() => {
                        setSelectedProduct(p);
                        setOpenDelete(true);
                      }}>
                      <FiTrash2 />
                    </IconButton> */}
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={8}>
              <Text fontSize='sm' color='gray.500' textAlign='right'>
                Total de produtos exibidos: {filteredProducts.length}
              </Text>
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>

      {/* Modal de confirmação de exclusão */}
      <Dialog.Root
        open={openDelete}
        onOpenChange={(e) => setOpenDelete(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirmar exclusão</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Dialog.Description>
                Tem certeza que deseja excluir o produto{' '}
                <strong>{selectedProduct?.name}</strong>?
                <br />
                Esta ação não poderá ser desfeita.
              </Dialog.Description>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant='outline' onClick={() => setOpenDelete(false)}>
                Cancelar
              </Button>
              <Button
                bg={'red.600'}
                onClick={handleConfirmDelete}
                disabled={loadingDelete}>
                Excluir
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};
