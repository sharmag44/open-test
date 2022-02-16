/**
 * @var {*} Sequelize
 * @property {function} save
 * @property {function} findOne
 * @property {function} findAll
 * @property {function} update
 */
// User
/**
 * @typedef {Object} UserI
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {string} countryCode
 * @property {string} imgUrl
 * @property {string} email
 * @property {string} secondaryEmail
 * @property {string} googleId
 * @property {string} facebookId
 * @property {string} password
 * @property {string} token
 * @property {boolean} isEmailVerified
 * @property {'pending'|'active'|'inactive'|'blocked'|'deleted'} status
 * @property {'admin'|'user'} role
 * @property {string} deviceType
 * @property {string} deviceId
 * @property {function} save
 * @property {function} findOne
 * @property {function} findAll
 * @property {function} update
 */

// Question
/**
 * @typedef {Object} QuestionI
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} topicTagString
 * @property {number} likeCount
 * @property {number} dislikeCount
 * @property {number} commentCount
 * @property {Array<number>} topicTagIds
 * @property {string} userId
 * @property {UserI} user
 * @property {function} save
 * @property {function} findOne
 * @property {function} findAll
 * @property {function} update
 */

// TopicTag
/**
 * @typedef {Object} TopicTagI
 * @property {string} id
 * @property {string} name
 * @property {function} save
 * @property {function} findOne
 * @property {function} findAll
 * @property {function} update
 */

// QuestionTag
/**
 * @typedef {Object} QuestionTagI
 * @property {string} id
 * @property {string} questionId
 * @property {QuestionI} question
 * @property {string} topicTagId
 * @property {TopicTagI} topicTag
 * @property {function} save
 * @property {function} findOne
 * @property {function} findAll
 * @property {function} update
 */

// Comment
/**
 * @typedef {Object} CommentI
 * @property {string} id
 * @property {string} description
 * @property {string} questionId
 * @property {QuestionI} question
 * @property {string} userId
 * @property {UserI} user
 * @property {function} save
 * @property {function} findOne
 * @property {function} findAll
 * @property {function} update
 *
 */
