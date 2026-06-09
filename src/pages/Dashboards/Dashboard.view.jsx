import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Progress,
  HStack,
} from '@chakra-ui/react';
import {
  getDashboardMetrics,
  getLowStockProducts,
  getSalesSummary,
  getTopSellingProducts,
} from '../../apis/dashboard';
import Loading from '../../components/Loading';
import { toaster } from '../../components/ui/toaster';

export const DashboardView = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [salesSummary, setSalesSummary] = useState({});
  const [dashboardMetrics, setDashboardMetrics] = useState({});
  const [loading, setLoading] = useState({
    lowStock: true,
    topSelling: true,
    salesSummary: true,
    dashboardMetrics: true,
  });

  const green = 'green.500';

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  useEffect(() => {
    getLowStockProducts()
      .then((data) => {
        setLowStockProducts(data.products);
      })
      .catch(() => {
        toaster.error({
          title: 'Erro ao carregar métricas de produtos com estoque baixo',
          description: 'Tente novamente mais tarde',
        });
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, lowStock: false }));
      });

    getTopSellingProducts()
      .then((data) => {
        setTopSellingProducts(data.products);
      })
      .catch(() => {
        toaster.error({
          title: 'Erro ao carregar métricas de produtos mais vendidos',
          description: 'Tente novamente mais tarde',
        });
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, topSelling: false }));
      });

    getSalesSummary()
      .then((data) => {
        setSalesSummary(data);
      })
      .catch(() => {
        toaster.error({
          title: 'Erro ao carregar resumo de vendas',
          description: 'Tente novamente mais tarde',
        });
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, salesSummary: false }));
      });

    getDashboardMetrics()
      .then((data) => {
        setDashboardMetrics(data);
      })
      .catch(() => {
        toaster.error({
          title: 'Erro ao carregar métricas do dashboard',
          description: 'Tente novamente mais tarde',
        });
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, dashboardMetrics: false }));
      });
  }, []);

  if (
    loading.lowStock ||
    loading.topSelling ||
    loading.salesSummary ||
    loading.dashboardMetrics
  ) {
    return <Loading message='Carregando métricas...' />;
  }

  return (
    <Box p={6} bg='white' rounded='md' shadow='md'>
      {/* Header */}
      <Flex justify='space-between' align='center' mb={6}>
        <Heading size='lg' fontWeight='bold'>
          Gerenciamento
        </Heading>
        <Text color='gray.500' fontSize='sm'>
          Controle completo do seu mercado
        </Text>
      </Flex>

      {/* Resumo principal */}
      <Flex
        gap={6}
        wrap='wrap'
        justify='space-between'
        mb={8}
        fontWeight='bold'
        fontSize='lg'>
        <Box>
          <Text fontSize='sm' color='gray.600'>
            Saldo Total
          </Text>
          <Text>{formatCurrency(dashboardMetrics.balance)}</Text>
        </Box>
        <Box color={green}>
          <Text fontSize='sm' color='gray.600'>
            Receita Hoje
          </Text>
          <Text>{formatCurrency(dashboardMetrics.revenue_today)}</Text>
        </Box>
        <Box color={green}>
          <Text fontSize='sm' color='gray.600'>
            Receita Mês
          </Text>
          <Text>{formatCurrency(dashboardMetrics.revenue_month)}</Text>
        </Box>
      </Flex>

      <Flex gap={6} wrap='wrap' justify='space-between'>
        {/* Alertas de Estoque */}
        <Box flex='1' minW='300px' borderWidth='1px' borderRadius='md' p={4}>
          <Flex align='center' mb={2}>
            <Text fontWeight='bold'>Alertas de Estoque</Text>
          </Flex>
          <Text fontSize='sm' mb={4} color='gray.600'>
            Produtos com estoque baixo ou em falta
          </Text>

          {lowStockProducts.length === 0 && (
            <Text fontSize='sm' color='gray.500'>
              Nenhum produto com estoque baixo ou em falta.
            </Text>
          )}

          {lowStockProducts.map((product) => (
            <Box mb={4}>
              <Flex justify='space-between' mb={1}>
                <Text>{product.name}</Text>
                {product.quantity === 0 ? (
                  <Badge bg='red.100' color='black'>
                    Em Falta
                  </Badge>
                ) : (
                  <Badge bg='yellow.100' color='black'>
                    Estoque Baixo
                  </Badge>
                )}
              </Flex>
              <Text fontSize='sm' color='gray.500'>
                Atual: {product.quantity} - Mínimo: 10
              </Text>
            </Box>
          ))}
        </Box>

        {/* Top Produtos */}
        <Box
          flex='1'
          minW='300px'
          borderWidth='1px'
          borderRadius='md'
          p={4}
          // bg={grayLight}
        >
          <Flex align='center' mb={4} justify='space-between'>
            <Text fontWeight='bold'>Top Produtos</Text>
            <Text fontSize='sm' color='gray.600'>
              Mais vendidos do mês
            </Text>
          </Flex>

          {topSellingProducts.length === 0 && (
            <Text fontSize='sm' color='gray.500'>
              Nenhum produto vendido no mês.
            </Text>
          )}

          {topSellingProducts.map((product, index) => (
            <Box mb={4}>
              <Flex justify='space-between' mb={1}>
                <Text fontWeight='semibold'>{product.name}</Text>
                <Badge colorScheme='gray' variant='outline' fontSize='xs'>
                  #{index + 1}
                </Badge>
              </Flex>
              <Flex justify='space-between' fontSize='sm' color='gray.600'>
                <Text>Vendas: {product.total_sold}</Text>
                <Text color={green}>
                  Receita: {formatCurrency(product.revenue)}
                </Text>
                <Text>Estoque: {product.quantity}</Text>
              </Flex>
            </Box>
          ))}
        </Box>

        {/* Resumo de Vendas */}
        <Box flex='1' minW='300px' borderWidth='1px' borderRadius='md' p={4}>
          <Flex align='center' mb={4} justify='space-between'>
            <Text fontWeight='bold'>Resumo de Vendas</Text>
            <Text fontSize='sm' color='gray.600'>
              Performance por período
            </Text>
          </Flex>

          {/* Hoje */}
          <Box mb={4}>
            <Flex justify='space-between' mb={1}>
              <Text>Hoje</Text>
              <Text fontSize='xs' color='gray.500'>
                {salesSummary.items_today} vendas
              </Text>
            </Flex>
            <Flex justify='space-between' fontWeight='semibold' mb={1}>
              <Text>Receita</Text>
              <Text color={green}>
                {formatCurrency(salesSummary.revenue_today)}
              </Text>
            </Flex>

            {/* <Box height="1px" bg="gray.200" my={3} /> */}
          </Box>

          {/* Ontem */}
          <Box mb={4}>
            <Flex justify='space-between' mb={1}>
              <Text>Ontem</Text>
              <Text fontSize='xs' color='gray.500'>
                {salesSummary.items_yesterday} vendas
              </Text>
            </Flex>
            <Flex justify='space-between' fontWeight='semibold' mb={1}>
              <Text>Receita</Text>
              <Text color={green}>
                {formatCurrency(salesSummary.revenue_yesterday)}
              </Text>
            </Flex>

            {/* <Box height="1px" bg="gray.200" my={3} /> */}
          </Box>

          {/* Esta Semana */}
          <Box>
            <Flex justify='space-between' mb={1}>
              <Text>Esta Semana</Text>
              <Text fontSize='xs' color='gray.500'>
                {salesSummary.items_week} vendas
              </Text>
            </Flex>
            <Flex justify='space-between' fontWeight='semibold' mb={1}>
              <Text>Receita</Text>
              <Text color={green}>
                {formatCurrency(salesSummary.revenue_week)}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
