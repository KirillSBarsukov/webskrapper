const viewPath = ('pages');

exports.home = (req, res) => {
  res.render(`${viewPath}/home`, {
    pageTitle: 'Welcome Home'
  });
};