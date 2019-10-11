const registerController = {};

registerController.getHelloWorld = (req, res) => {
    res.status(200).send('Hello World!')
}

module.exports = registerController;