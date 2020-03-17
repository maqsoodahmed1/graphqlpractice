 const express = require('express')
 const bodyParser = require('body-parser')
 const graphqlHttp = require('express-graphql')
const {buildSchema} = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/event')
const User = require('./models/user')
const bcrypt = require('bcrypt')

 const app = express()

 app.use(bodyParser.json())
 mongoose.connect('mongodb://localhost/graphqlpractice',{useNewUrlParser:true,useUnifiedTopology:true})
 .then(()=>console.log('connected to mongodb'))
 .catch(error => console.log(error))

app.use('/graphql',graphqlHttp({
    schema:buildSchema(
`
type Event {
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
    creator:User!
}

input EventInput{
    title:String!
    description:String!
    price:Float!
    date:String!
}

type User {
    _id:ID!
    email:String!
    password:String!
}

input UserInput{
    email:String!
    password:String!
} 



type RootQuery{
    events:[Event!]!
    users:[User!]!
}

type RootMutation{

    createEvent(eventInput:EventInput):Event
    createUser(userInput:UserInput):User
}




schema {
    query:RootQuery
    mutation:RootMutation
}


`

    ),
    rootValue:{
        events:async()=>{

                let event = await Event.find().populate('creator')
                let events = [...event]
                return events.map(element => {
                    return element
                });
            
        }
        ,
        users:async()=>{
            let users = await User.find().populate('createdEvents')
            return users.map(elements =>{
                
                return elements
            })
        }
    
        ,
        createEvent:async(args)=>{


            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date:new Date(args.eventInput.date),
                creator:"5e7094f1fcf9ec4563269880"
            })
             let user = await User.findById("5e7094f1fcf9ec4563269880")
            user.createdEvents.push(event)
            user.save()
             const response = await event.save()
            console.log(response._doc)
      
            return event;
        }
        ,
        createUser:async(args)=>{

            try {
                
                let user = await User.findOne({email:args.userInput.email})
                if(user) throw new Error('user already registered');
                let password = await bcrypt.hash(args.userInput.password,12)
                 user = new User ({
                email:args.userInput.email,
                password
            })
            const response = await user.save()
            console.log(response._doc)
            return response._doc
            
            }
             catch (error) {
                throw error
            }
        }


    }
    ,
    graphiql:true
}))


 app.listen(3000)
     // events.map(even=>{
                //     return even
                // })
                // console.log(events[0].creator)
                // return event
            //  Event.find()
            //  .then(events =>{
            //      return events.map(event=>{
            //          console.log(event)

            //          return event
            //      })
            //  })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        //    console.log(event)
        //    console.log(event.creator)
        //    return event
        //   return  event.map(events => events.creator)