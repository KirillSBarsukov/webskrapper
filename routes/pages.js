const { home } = require('../controllers/PagesController');

module.exports = router => {
  router.get('/', home);
};