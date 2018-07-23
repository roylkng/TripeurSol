##Steps to Run:
Go the the directory and execute following commands.
For installation(nodejs is required)
`npm i`
`npm i -g mocha`
For execution
`npm start`
For running unit test.
`npm test`

Logs can be found at `logs/log`

#Domin:
There are mainly three parts for thies peice of module.
1) Users with mobile Number
2) Proivedrs who allocates offers to users
3) Usage by Users based upon the offers allocated and rules for allocation

#Design:
The idea is to allocate offers to users basend on thier present state. So first thing we need to know is the users with thier mobile numbers. Load the users in the databse/file first. (Always a good idea to cache them).
Now for the offers basic validatons and parsing data in consumable format is the first thing.
After that allocate offers to users based on thier current offers status and applicable rules.
Once that is done the last step is to foramt the data in more meaningful manner for the client.
