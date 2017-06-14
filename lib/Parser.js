module.exports.parseTweet = tweet => {
    let sTweet = new String(tweet)
    let parts = sTweet.replace(/\B@[a-z0-9_-]+/gi, "").split(' to ')
    return parts
}