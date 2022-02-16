exports.localeErrors = (req, res, next) => {
     try {
          const language = req.headers['language'] || 'en';
          const errors = require(`../locale/errors/${language}.js`);
          if (!errors) throw 'language not preset';
          req.errors = errors;
          next();
     } catch (error) {
          res.send({ isSuccess: false, error: 'language not preset' });
     }
};
