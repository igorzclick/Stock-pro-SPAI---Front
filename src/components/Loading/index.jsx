import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const Loading = ({ message = 'Carregando...' }) => {
  return (
    <Flex
      position='fixed'
      top={0}
      left={0}
      w='100vw'
      h='100vh'
      backdropFilter='blur(4px)'
      zIndex={9999}
      direction='column'
      align='center'
      justify='center'
      transition='all 0.3s ease-in-out'>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        size='xl'
        mb={4}
      />
      <Text fontWeight='medium'>{message}</Text>
    </Flex>
  );
};

export default Loading;
