const shoppingListItems = require('../src/shopping-list-service')
const knex = require('knex');

describe(`ShoppingList object`, function() {
    let db;

    let testItems = [
        {
            id: 2,
            name: 'First test item!',
            price: "4.00",
            date_added: new Date(),
            checked: false,
            category: 'Snack',
            
        },
        {
            id: 1,
            name: 'Second test item!',
            price: "5.00",
            date_added: new Date(),
            checked: false,
            category: 'Snack',
        },
        {
            id: 3,
            name: 'Third test item!',
            price: "6.00",
            date_added: new Date(),
            checked: false,
            category: 'Snack',
        },
    ]

    before(() => {
     db = knex({
       client: 'pg',
       connection: process.env.TEST_DB_URL,
      })
    })

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    before(() => db('shopping_list').truncate())

    context(`Given 'getAllShoppingList()' has data`, () => {

        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`resolves all items from 'shopping_list' table`, () => {
        //    test that ArticlesService.getAllArticles gets data from table
        return shoppingListItems.getAllShoppingList(db)
            .then(actual => {
            expect(actual).to.eql(testItems)
            })
        })

        //FINDS AN ITEM BY ID

        it(`getByShoppingId() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return shoppingListItems.getByShoppingId(db, thirdId)
            .then(actual => {
                expect(actual).to.eql({
                id: thirdId,
                name: thirdTestItem.name,
                price: thirdTestItem.price,
                date_added: thirdTestItem.date_added,
                checked: thirdTestItem.checked,
                category: thirdTestItem.category
                })
            })
        })

        //DELTES AN ITEM BY ID

        it(`deleteShoppingItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return shoppingListItems.deleteShoppingItem(db, itemId)
            .then(() => shoppingListItems.getAllShoppingList(db))
            .then(allItems => {
                // copy the test articles array without the "deleted" article
                const expected = testItems.filter(item => item.id !== itemId)
                expect(allItems).to.eql(expected)
            })
        })

        //UPDATES AN ITEM BY ID

        it(`updateShoppingItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItem = 3
            const newItemData = {
            name: 'updated name',
            price: '7.00',
            date_added: new Date(),
            checked: true,
            category: 'Lunch'
            }
            return shoppingListItems.updateShoppingItem(db, idOfItem, newItemData)
            .then(() => shoppingListItems.getByShoppingId(db, idOfItem))
            .then(item => {
                expect(item).to.eql({
                id: idOfItem,
                ...newItemData,
                })
            })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllShoppingList() resolves an empty array`, () => {
            return shoppingListItems.getAllShoppingList(db)
            .then(actual => {
                expect(actual).to.eql([])
            })
        })
    })

    it(`insertShoppingItem() inserts an item and resolves the item with an 'id'`, () => {
        const newItem = {
            name: 'Test new item',
            price: '5.00',
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: false,
            category: "Snack"
        }

        return shoppingListItems.insertShoppingItem(db, newItem)
        .then(actual => {
                expect(actual).to.eql({
                id: 1,
                name: newItem.name,
                price: newItem.price,
                date_added: newItem.date_added,
                checked: newItem.checked,
                category: newItem.category
                })
            });
    })
})