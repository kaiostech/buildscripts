

/**
 * To, a wrapper to always returna a promise as Tuple<Error,Result>
 *
 * @param {Promise} promise
 * @param {Object} errorExt
 * @returns
 */
function to(promise, errorExt) {
    return promise
        .then(data => [null, data])
        .catch((err) => {
            if (errorExt) {
                Object.assign(err, errorExt);
            }

            return [err, undefined];
        });
}

module.exports = { to }