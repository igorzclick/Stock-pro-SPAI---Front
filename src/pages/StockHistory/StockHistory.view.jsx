import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  HStack,
  Table,
  InputGroup,
  Badge,
  NativeSelect,
} from '@chakra-ui/react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  getStockMovements,
  exportStockMovements,
} from '../../apis/stockMovement';
import { toaster } from '../../components/ui/toaster';
import Loading from '../../components/Loading';

// Cada tipo de movimentação tem um rótulo e cor próprios
const TYPE_META = {
  ENTRADA: { label: 'Entrada', color: 'green' },
  SAIDA: { label: 'Saída', color: 'red' },
  AJUSTE: { label: 'Ajuste', color: 'orange' },
};

export const StockHistoryView = () => {
  const [movements, setMovements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('all');
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getStockMovements({ type, period })
      .then((data) => setMovements(data.movements || []))
      .catch(() =>
        toaster.error({
          title: 'Erro ao carregar histórico',
          description: 'Tente novamente mais tarde',
        })
      )
      .finally(() => setLoading(false));
  }, [type, period]);

  const filteredMovements = searchTerm
    ? movements.filter((m) => m.product_id === parseInt(searchTerm))
    : movements;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = parseISO(dateString);
    const threeHoursBefore = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    return format(threeHoursBefore, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const handleExport = () => {
    setExporting(true);
    exportStockMovements({ type, period })
      .then(() =>
        toaster.success({
          title: 'Exportação concluída',
          description: 'O arquivo historico_estoque.csv foi baixado.',
        })
      )
      .catch(() =>
        toaster.error({
          title: 'Erro ao exportar',
          description: 'Não foi possível gerar o CSV. Tente novamente.',
        })
      )
      .finally(() => setExporting(false));
  };

  if (loading) {
    return <Loading message='Carregando histórico de estoque...' />;
  }

  return (
    <Box p={6} bg='white' rounded='md' shadow='md'>
      {/* Header */}
      <Flex justify='space-between' align='center' mb={6} wrap='wrap' gap={4}>
        <Box>
          <Heading size='lg' fontWeight='bold' mb={2}>
            Histórico de Estoque
          </Heading>
          <Text color='gray.500' fontSize='sm'>
            Acompanhe todas as entradas, saídas e ajustes do seu estoque
          </Text>
        </Box>
        <Button
          colorScheme='blue'
          onClick={handleExport}
          disabled={exporting || filteredMovements.length === 0}>
          <FiDownload style={{ marginRight: 8 }} />
          {exporting ? 'Exportando...' : 'Exportar CSV'}
        </Button>
      </Flex>

      {/* Filtros e Busca */}
      <Flex gap={4} mb={4} wrap='wrap' align='center'>
        <HStack spacing={2} maxW='400px' flex='1'>
          <InputGroup startElement={<FiSearch />}>
            <Input
              placeholder='Buscar por ID do produto'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              flex='1'
            />
          </InputGroup>
        </HStack>
        <NativeSelect.Root maxW='200px'>
          <NativeSelect.Field
            value={type}
            onChange={(e) => setType(e.target.value)}>
            <option value='all'>Todos os tipos</option>
            <option value='ENTRADA'>Entradas</option>
            <option value='SAIDA'>Saídas</option>
            <option value='AJUSTE'>Ajustes</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <NativeSelect.Root maxW='200px'>
          <NativeSelect.Field
            value={period}
            onChange={(e) => setPeriod(e.target.value)}>
            <option value='all'>Todo o período</option>
            <option value='today'>Hoje</option>
            <option value='week'>Última semana</option>
            <option value='month'>Este mês</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>

      {/* Tabela de Movimentações */}
      <Box overflow='hidden'>
        <Table.Root
          size='md'
          borderWidth='1px'
          borderRadius='md'
          overflow='hidden'>
          <Table.Header bg='gray.50'>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Data</Table.ColumnHeader>
              <Table.ColumnHeader>Produto (ID)</Table.ColumnHeader>
              <Table.ColumnHeader textAlign='center'>Tipo</Table.ColumnHeader>
              <Table.ColumnHeader textAlign='center'>
                Quantidade
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign='center'>
                Estoque (antes → depois)
              </Table.ColumnHeader>
              <Table.ColumnHeader>Origem</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredMovements.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign='center' py={6}>
                  <Text color='gray.500'>
                    Nenhuma movimentação encontrada
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredMovements.map((m) => {
                const meta = TYPE_META[m.movement_type] || {
                  label: m.movement_type,
                  color: 'gray',
                };
                return (
                  <Table.Row key={m.id} _hover={{ bg: 'gray.50' }}>
                    <Table.Cell fontWeight='semibold'>{m.id}</Table.Cell>
                    <Table.Cell>{formatDate(m.created_at)}</Table.Cell>
                    <Table.Cell>{m.product_id}</Table.Cell>
                    <Table.Cell textAlign='center'>
                      <Badge colorScheme={meta.color} variant='subtle'>
                        {meta.label}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign='center' fontWeight='semibold'>
                      {m.quantity}
                    </Table.Cell>
                    <Table.Cell textAlign='center' color='gray.600'>
                      {m.quantity_before} → {m.quantity_after}
                    </Table.Cell>
                    <Table.Cell>{m.reason || '-'}</Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Text fontSize='sm' color='gray.500' textAlign='right'>
                  Total de movimentações exibidas: {filteredMovements.length}
                </Text>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Box>
    </Box>
  );
};
