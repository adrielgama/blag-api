import swaggerJsDoc from 'swagger-jsdoc'

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BLAG API',
      version: '1.0.0',
      description:
        'If you are looking for an API with authentication and that provides a dashboard for your blog, this is the best choice. ',
    },
    servers: [
      {
        url: process.env.PORT || 'http://localhost:3000',
      },
    ],
  },
  apis: ['src/routes/*.ts'],
  removeComments: false,
}

const specs = swaggerJsDoc(options)

export default specs
