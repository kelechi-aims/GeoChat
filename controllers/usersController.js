const User = require('../models/users')
const DbClient = require('../utils/db')

const dbClient = new DbClient();

class UsersController {
    static async createUser(req, res) {
        try {
            const { firstname, secondname, username, email, course, cohort, password, imagePath, location} = req.body

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Request body is missing or empty' });
            }

            const { country,  region, town, latitude, longitude } = location || {}

            //validate
            if (!username) {
                console.log('no username provided')
                res.status(400).json({ error: 'username not provided'})
                return
            }

            if (!imagePath) {
                console.log('image path not found')
                res.status(400).json({ error: 'image path missing'})
                return
            }
            if (!firstname || !secondname ) {
                console.log('unable to get the names')
                res.status(400).json({ error: 'Names are missing' })
                return
            }
            if (!course || !cohort) {
                console.log('unable to get school credentials')
                res.status(400).json({ error: 'Course credentials are Missing' })
                return
            }
            if (!email) {
                console.log('Missing email')
                res.status(400).json({ error: 'Missing email' })
                return
            }
            if (!password) {
                console.log('unable to get password')
                res.status(400).json({ error: 'password is missing' })
                return
            }

            if (!country || !region || !town) {
                console.log('Country, region or town is missing')
                res.status(400).json({ error: 'Country, region or town missing'})
                return
            }

            if (!longitude || !latitude) {
                //it should not return anything because the latitude longitude are not mandatory
                //this is because the user might not allow us to access his/her location through the api
                console.log('did not recieve the longitude and latitude from google maps api')
            }

            // Validate whether user is already stored in the database.
            const user = await dbClient.getUserByEmail(email)
            if (user != null) {
                console.log('user already exists in the db')
                res.status(200).json({ error: 'User already exists'})
                return
            } else {
                try {
                    const newUser = await User.create({
                        username,
                        firstname,
                        secondname,
                        email,
                        course,
                        cohort,
                        password,
                        imagePath,
                        location: {
                            country,
                            region,
                            town,
                            latitude,
                            longitude
                        }
                    });
                    res.status(201).json({ Success: `created new User ${newUser}`})
                } catch(error) {
                    console.log('Error: Unable to create user', error)
                    res.status(500).json({ error: 'internal server error' })
                }
            }
            
        } catch(error) {
            console.log(error)

        }
    }

    static async listAllUsers(req, res) {}
}

module.exports = UsersController;
