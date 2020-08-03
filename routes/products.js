const { index, update } = require('../controllers/ProductsController');

module.exports = router => {
    router.get('/products', index);
    router.get('/products/update', update);
};
