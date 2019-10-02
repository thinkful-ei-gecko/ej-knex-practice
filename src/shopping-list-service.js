const shoppingListItems = {
    getAllShoppingList(knex) {
        return knex.select('*').from('shopping_list');
    },
    insertShoppingItem(knex, newItem) {
        return knex.insert(newItem).into('shopping_list').returning('*')
        .then(rows => {
            return rows[0];
        })
    },
    getByShoppingId(knex, id) {
        return knex.from('shopping_list').select('*').where('id', id).first()
        },
    deleteShoppingItem(knex, id) {
        return knex('shopping_list')
            .where({ id })
            .delete()
        },
    updateShoppingItem(knex, id, newItemInfo) {
        return knex('shopping_list')
            .where({ id })
            .update(newItemInfo)
         },
}

module.exports = shoppingListItems