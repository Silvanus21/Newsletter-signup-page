const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()

//middlewares
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended : true}))


//routes and different type of methods
app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {

    const firstName = req.body.firstName
    const secondName = req.body.secondName
    const email = req.body.email

    const output = {
        members : [
            {
                email_address : email,
                status  : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : secondName
                }
            }
        ]
    }

    const jsonOutput = JSON.stringify(output)

    const url = "https://us10.api.mailchimp.com/3.0/lists/2f555b07fb"
    const options = {
        method : "POST",
        auth : "selva21:2a3ecb75eb7cdc512983748d27d8662b-us10"
    }

    const request = https.request(url, options, (response) => {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }
    })

    request.write(jsonOutput)
    request.end()

})

app.post("/failure", (req, res) => {
    res.redirect("/")
})


//setting up the server
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server live at port ${port}`)
})
