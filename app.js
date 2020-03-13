 const express = require('express')
 const bodyParser = require('body-parser')
 const graphqlHttp = require('express-graphql')
const {buildSchema} = require('graphql')


 const app = express()

 app.use(bodyParser.json())

app.use('/graphql',graphqlHttp({
    schema:buildSchema(
`
type Event {
    _id:ID!
    name:String!
    description:String!
    price:Float!
    date:String!
}

input EventInput{
    name:String!
    description:String!
    price:Float!
    date:String!
}


type RootQuery{

    events:[Event!]!
    users:[String!]!


}
type RootMutation{

    createEvent(eventInput:EventInput):String
    createUsers(user:String):String
}




schema {
    query:RootQuery
    mutation:RootMutation
}


`

    ),
    rootValue:{
        events:()=>{
          return ['Maqsood','Zain','Zaufishan','Arooj']  
        }
        ,users:()=>{
            return['test1','test2','test3']
        }
        ,
        createEvent:(args)=>{
            const eventName = arg.eventName
            return eventName
        },
        createUsers:(args)=>{
            const user = arg.user
            return user
        }

    }
    ,
    graphiql:true
}))


 app.listen(3000)
 