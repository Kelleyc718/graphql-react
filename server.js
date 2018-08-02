import express from 'express';
import expressGraphQL from 'express-graphql';
import schema from "./schemas/schema";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});