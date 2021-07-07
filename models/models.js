const Sequelize = require('sequelize');

const coords = {
    lon: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
    },
    lat: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER
    }
}


module.exports = {
    coords
};