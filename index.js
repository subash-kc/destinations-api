const express = require("express")

let {destinations} = require('./db')

const cors = require('cors')

const fetch = require('node-fetch')

//console.log(destinations)

const {generateUniqueId}= require('./services')

const {getUnsplashPhoto} = require('./services')

const server = express();
//parse the any body that comes in json
server.use(express.json())

server.use(cors())

server.use(express.urlencoded())

//console.log(process);

let PORT = process.env.PORT || 3000;

server.listen(PORT, function() {
    console.log(`Server Listening on PORT ${PORT}`);
});

//Post => create destinations
//data => {name, location, photo, description}
server.post("/destinations", async (req, res)=>{

    //destructing yes
    const { name, location, description} = req.body;

    if(!name || name.length===0 || !location || location.length===0) {
        return res
            .status(400)
            .json({message: "Name and Location are both required"})
    }

    const dest = { id: generateUniqueId(), name, location };

    const UNSPLASH_URL = `https://api.unsplash.com/photos/random?client_id=H1u5tbyFY_ziw-O82Ll_5WLww9Ar7VHS_h-SqbIBDfQ&q=${name} ${location}`

    const fetchRes = await fetch(UNSPLASH_URL);
    const data = await fetchRes.json()

    dest.photo = data.urls.small;

    if (description && description.length !==0) {
        dest.description = description;
    }

    destinations.push(dest);
    res.redirect('/destinations');
})

server.get("/destinations", (req, res) => {
    console.log('destinations', destinations)
   res.send(destinations);
})

//put => edit 
server.put("/destinations/", (req, res)=>{

    const { id, name, location, description } = req.body

    const {name, location, description} = req.body
    const {id} = req.params;

    if(id ===undefined) {
        return res.status(400).json({ message: "id is required" })
    }

    if(name !== undefined && name.length ===0) {
        return res.status(400).json({ message: "Name can't be empty" })
    }

    if(location !== undefined && location.length === 0) {
        return res.status(400).json({ message: "Location can't be empty" })
    }

    for(const dest of destinations) {
        if(dest.id ===id) {

           if(name !== undefined) {
                dest.name = name;
            }

    
            
            if(location !==undefined) {
                dest.location = location;
            }

            if(name!== undefined || location !== undefined) {
                dest.photo = await getUnsplashPhoto({
                    name: dest.name,
                    location: dest.location
                })
            }

            if(description !== undefined) {
                dest.description = description
            }
            return res.json(dest);
        }
    }
    
   

    //console.log(destId);

    // const newDestinations = destinations.filter((dest)=>dest.id!==destId)
    // destinations = newDestinations;

    // res.redirect('/destinations')
})

//Delete a destination add.
//How to get the id from the reqs
//route paramenters /destinations/:id => req.params.id
//query /destinations?id=128478 => req.query.id
server.delete("/destinations/:id", (req,res)=>{
    const destId = req.params.id;
    console.log(destId)
    const newDestinations = destinations.filter((dest)=> dest.id !==destId);
    destinations = newDestinations;
    //console.log(req.params.id)

    // res.redirect(303, "/destinations")

    res.send(destinations);
})