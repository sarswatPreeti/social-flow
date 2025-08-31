const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Specific limiter for post creation
const postCreationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 post creations per minute
  message: {
    error: 'Too many post creations, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific limiter for voting
const votingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 votes per minute
  message: {
    error: 'Too many votes, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
  postCreationLimiter,
  votingLimiter
};
