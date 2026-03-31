import React,  { useEffect } from "react";
import { Box, Button, Center, Flex, Heading, Icon, Image, Stack, Text} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { FaShoppingCart, FaChartBar, FaShieldAlt } from "react-icons/fa";
import logo from '../../assets/logo_editada.png';
import { isAuthenticated } from "../../apis/login";



export const HomeView = () => {
    const navigate = useNavigate();
    useEffect(() => {
      if (isAuthenticated()) {
        navigate('/');
      }
    }, [navigate]);

  

  return (
    <Box w="100%" minH="100vh" bgGradient="linear(to-b, white, blue.50)">
      {/* Header */}
      <Flex justify="space-between" align="center" px={8} py={4}>
        <Flex align="center">
          <Image src={logo} alt="Logo" height="70px" mr={2} />
          {/* <Text fontWeight="bold" fontSize="xl">Stock Pro</Text> */}
        </Flex>
        <Flex gap={4}>
          <Button variant="ghost" onClick={() => navigate("/auth/login")}>Entrar</Button>
          <Button colorScheme="blue" onClick={() => navigate("/seller/register")}>Cadastrar-se</Button>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Center mt={20} px={4}>
        <Stack spacing={6} align="center" textAlign="center" maxW="600px">
          <Heading as="h1" size="2xl">
            Gestão de Estoque <Text as="span" color="blue.500">Inteligente</Text>
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Sistema completo para gerenciar seu mini mercado com segurança, controle de vendas e estoque em tempo real.
          </Text>
          <Flex gap={4}>
            <Button colorScheme="blue" onClick={() => navigate("/dashboard")}>
              Começar Agora
            </Button>
            <Button variant="outline" onClick={() => navigate("/demo")}>
              Ver Demo
            </Button>
          </Flex>
        </Stack>
      </Center>

      {/* === NOVA SEÇÃO === */}
      <Box mt={32} px={8}>
        {/* Cards de recursos */}
        <Flex justify="center" flexWrap="wrap" gap={8}>
          <Box
             bg="white"
            boxShadow="xl"
            borderRadius="md"
            p={6}
            textAlign="center"
            w={["100%", "45%", "30%"]}
            transition="all 1.3s ease"
          >
            <Icon as={FaShoppingCart} boxSize={8} color="blue.500" mb={3} />
            <Heading as="h3" size="md" mb={2}>Controle de Vendas</Heading>
            <Text color="gray.600">
              Registre vendas rapidamente e mantenha seu estoque sempre atualizado
            </Text>
          </Box>

          <Box
             bg="white"
            boxShadow="xl"
            borderRadius="md"
            p={6}
            textAlign="center"
            w={["100%", "45%", "30%"]}
            transition="all 1.3s ease"
          >
            <Icon as={FaChartBar} boxSize={8} color="green.500" mb={3} />
            <Heading as="h3" size="md" mb={2}>Relatórios Detalhados</Heading>
            <Text color="gray.600">
              Acompanhe o desempenho do seu negócio com relatórios em tempo real
            </Text>
          </Box>

          <Box
             bg="white"
            boxShadow="xl"
            borderRadius="md"
            p={6}
            textAlign="center"
            w={["100%", "45%", "30%"]}
            transition="all 1.3s ease"
          >
            <Icon as={FaShieldAlt} boxSize={8} color="orange.400" mb={3} />
            <Heading as="h3" size="md" mb={2}>Segurança Total</Heading>
            <Text color="gray.600">
              Seus dados protegidos com autenticação segura e controle de acesso
            </Text>
          </Box>
        </Flex>

       
  {/* Chamada para ação */}
<Center mt={16}>
  <Box
    background="linear-gradient(270deg,rgb(1, 31, 59),rgb(0, 83, 151),rgb(101, 129, 255))"
    backgroundSize="200% 200%"
    animation="gradientShift 8s ease infinite"
    color="white"
    borderRadius="lg"
    p={[6, 8, 12]}
    textAlign="center"
    maxW="1275px"
    w="100%"
    sx={{
      "@keyframes gradientShift": {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
      },
    }}
  >
    <Heading size="lg" mb={3}>
      Pronto para revolucionar seu negócio?
    </Heading>
    <Text fontSize="md" mb={6}>
      Junte-se a centenas de mini mercados que já transformaram sua gestão com o StockPro.
    </Text>
    <Button
  colorScheme="whiteAlpha"
  onClick={() => navigate("/seller/register")}
  transition="all 1.3s ease"
  _hover={{
    transform: "scale(1.08)",
    background: "linear-gradient(to right, #2B6CB0, #2C5282)",
    color: "white",
    cursor: "pointer"
  }}
  _active={{
    transform: "scale(1.98)",
  }}
>
  Cadastrar Meu Mercado
</Button>

  </Box>
</Center>



      </Box>
    </Box>  
  );
};
