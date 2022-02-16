exports.checkSlots = ({ date, startTime, endTime, propertyId }) => {
     const schedule = db.schedule.findOne({
          where: {
               date,
               startTime,
               endTime,
               propertyId,
          },
     });
};
