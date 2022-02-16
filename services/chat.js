const { Op } = require('sequelize');

exports.checkChatIfAlreadyExist = async ({ user1Id, user2Id, propertyId }) => {
     try {
          const foundChat = await db.chat.findOne({
               where: {
                    [Op.or]: [
                         {
                              user1Id,
                              user2Id,
                         },
                         {
                              user1Id: user2Id,
                              user2Id: user1Id,
                         },
                    ],
                    propertyId,
               },
          });
          return foundChat;
     } catch (error) {
          throw error;
     }
};
