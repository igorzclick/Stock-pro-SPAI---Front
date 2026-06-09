import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Stack,
  HStack,
  IconButton,
  Table,
  InputGroup,
  Dialog,
} from "@chakra-ui/react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { deleteSale, getSales } from "../../apis/sale";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toaster } from "../../components/ui/toaster";
import Loading from "../../components/Loading";

export const SalesView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState([]);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSales()
      .then((data) => setSales(data.sales))
      .catch(() =>
        toaster.error({
          title: "Erro ao carregar vendas",
          description: "Tente novamente mais tarde",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredSales = searchTerm
    ? sales.filter(
        (sale) =>
          sale.id === parseInt(searchTerm) ||
          sale.product_id === parseInt(searchTerm)
      )
    : sales;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const threeHoursBefore = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    return format(threeHoursBefore, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const handleConfirmDelete = () => {
    if (selectedSale) {
      setLoadingDelete(true);
      deleteSale(selectedSale.id)
        .then(() => {
          toaster.success({
            title: "Venda excluída",
            description: `Venda ${selectedSale.id} foi removida com sucesso.`,
          });
          setSales((prev) => prev.filter((s) => s.id !== selectedSale.id));
          setOpenDelete(false);
          setSelectedSale(null);
        })
        .catch((err) => {
          toaster.error({
            title: "Erro ao excluir venda",
            description:
              err?.response?.data?.message || "Tente novamente mais tarde",
          });
        })
        .finally(() => {
          setLoadingDelete(false);
        });
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + (sale.price || 0), 0);

  if (loading) {
    return <Loading message="Carregando vendas..." />;
  }

  return (
    <Box p={6} bg="white" rounded="md" shadow="md">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" fontWeight="bold" mb={2}>
            Vendas
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Gerencie todas as suas vendas
          </Text>
        </Box>
      </Flex>

      {/* Resumo */}
      <Flex gap={6} wrap="wrap" mb={6}>
        <Box
          flex="1"
          minW="200px"
          borderWidth="1px"
          borderRadius="md"
          p={4}
          bg="blue.50"
        >
          <Text fontSize="sm" color="gray.600" mb={1}>
            Total em Vendas
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            {formatCurrency(totalSales)}
          </Text>
        </Box>

        <Box
          flex="1"
          minW="200px"
          borderWidth="1px"
          borderRadius="md"
          p={4}
          bg="purple.50"
        >
          <Text fontSize="sm" color="gray.600" mb={1}>
            Quantidade de Vendas
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">
            {sales.length}
          </Text>
        </Box>
      </Flex>

      {/* Filtros e Busca */}
      <HStack spacing={2} maxW="400px" flex="1">
        <InputGroup startElement={<FiSearch />}>
          <Input
            placeholder="Buscar por ID da venda ou ID do produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            flex="1"
          />
        </InputGroup>
      </HStack>

      {/* Tabela de Vendas */}
      <Box overflow="hidden">
        <Table.Root
          size="md"
          borderWidth="1px"
          borderRadius="md"
          overflow="hidden"
        >
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Data</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="left">
                ID do Produto
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="left">
                Quantidade
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="left">Total</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Deletar
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredSales.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} textAlign="center" py={6}>
                  <Text color="gray.500">Nenhuma venda encontrada</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredSales.map((sale) => (
                <Table.Row key={sale.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight="semibold">{sale.id}</Table.Cell>
                  <Table.Cell>{formatDate(sale.created_at)}</Table.Cell>
                  <Table.Cell textAlign="left">{sale.product_id}</Table.Cell>
                  <Table.Cell textAlign="left">{sale.quantity}</Table.Cell>
                  <Table.Cell
                    textAlign="left"
                    color="green.600"
                    fontWeight="semibold"
                  >
                    {formatCurrency(sale.price)}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <IconButton
                      size="sm"
                      variant="ghost"
                      aria-label="Excluir"
                      color="red"
                      onClick={() => {
                        setSelectedSale(sale);
                        setOpenDelete(true);
                      }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={6}>
                <Text fontSize="sm" color="gray.500" textAlign="right">
                  Total de vendas exibidas: {filteredSales.length}
                </Text>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Box>

      {/* Modal de confirmação de exclusão */}
      <Dialog.Root
        open={openDelete}
        onOpenChange={(e) => setOpenDelete(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirmar exclusão</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Dialog.Description>
                Tem certeza que deseja excluir a venda{" "}
                <strong>ID {selectedSale?.id}</strong>?
                <br />
                Esta ação não poderá ser desfeita.
              </Dialog.Description>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Cancelar
              </Button>
              <Button
                bg={"red.600"}
                onClick={handleConfirmDelete}
                disabled={loadingDelete}
              >
                Excluir
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};
