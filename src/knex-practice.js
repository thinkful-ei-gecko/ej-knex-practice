require('dotenv').config();
const knex = require('knex');
const shoppingListItems = require('./shopping-list-service');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

function searchByName(searchTerm){
    knexInstance
        .select('name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        });
}

function paginateProducts(page){
    const productsPerPage = 6;
    const offset = productsPerPage * (page - 1);

    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        });
}

function getByDate(daysAgo){
    //(now() - '?? days'::INTERVAL, daysAgo)

    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
        .then(result => {
            console.log(result)
        });
}

function totalByCategory(){
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        });
}

// searchByName('wings');
// paginateProducts(2);
// getByDate(25);
totalByCategory();
console.log(shoppingListItems)