import swaggerAutogen from 'swagger-autogen';

const swaggerAutogenInstance = swaggerAutogen();

const doc = {
  info: {
    title: 'API Gerenciamento de Usuários',
    description: 'Cadastro, login, listagem e atualização de usuários',
  },
  host: 'localhost:3000', 
  schemes: ['http'], 
};

const outputFile = './swagger_output.json'; 
const endpointsFiles = ['./routes/private.js', './routes/public.js']; 


swaggerAutogenInstance(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentação gerada com sucesso!');
});
