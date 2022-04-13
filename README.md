# BikeFriendlyLandlord
An app for tenants to find and communicate with bike and pet friendly landlords

## Requirements
- A Node development environment
- Postgres database instance
- [Google Geocoding API key](https://developers.google.com/maps/documentation/geocoding/overview)
## Environment Setup
1. Clone this repo
2. Run `npm install`
3. Setup a Postgres instance using `server/models/schema.sql`
4. Copy `template.env` and rename `.env` and enter the appropriate keys.  

## Running an Instance
* `npm run dev` to run in development
* `npm run build` to create a production build

To Do / Ideas
* generaly clean things up. It got messy.
* add flitering to the map maybe
* edit the ratings in a landlord reviews
* re calculate landlord ratings when deleting a rewiew
* upadte account settings (username, password, etc)
* from 'my account' page, reviews arn't assoctianted with ary landlord
* more search parameters to filter landlords (sqft, name, review rating)
* sort results on search page + pagination

Extension
* add a new landlord and address + delete a landlord
* messaging between landlords and users
* landlord replying to reviews
* sign in as a landlord and take possesion of a landlord prorfile.
* if landlord has an acconut, populate landlord page wiht email, phone number, etc.
