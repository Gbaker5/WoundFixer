module.exports = {
    confirmActionMiddleware: function(req, res, next) {
        // Assuming you have a parameter indicating the action in the request
        const action = req.params.action;
      
        // You can customize the confirmation message based on the action
        const confirmationMessage = `This will delete name and all wounds from database ${action}. Are you sure?`;
      
        // Send confirmation message to the client
        res.render('confirmation.ejs', { confirmationMessage });
      }
};