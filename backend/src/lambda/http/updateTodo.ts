// import 'source-map-support/register';

// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// import * as middy from 'middy';
// import { cors } from 'middy/middlewares';

// import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';


// import { updateTodo } from '../../businessLogic/todos';
// import { getToken, parseUserId } from '../../auth/utils';
// import { createLogger } from '../../utils/logger';

// const logger = createLogger('create');

// export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const todoId = event.pathParameters.todoId;
//   const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);


//   console.log('Processing event: ', event);

//   // Get user id
//   const authHeader = event.headers.Authorization;
//   const jwtToken = getToken(authHeader);
//   logger.info('jwtToken: ', { jwtToken: jwtToken });

//   const userId = parseUserId(jwtToken);
//   logger.info('userId: ', { userId: userId });

//   try {
//     await updateTodo(todoId, updatedTodo, userId);

//   } catch (e) {

//     return {
//       statusCode: 404,
//       body: `error ${e}`
//     };
//   }

//   return {
//     statusCode: 204,
//     body: ''
//   };
// });

// handler.use(
//   cors({
//     credentials: true
//   })
// );
