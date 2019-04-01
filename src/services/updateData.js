import formModel from '../models/linkSchema';

/**
 *
 *
 * @param {*} url
 * @param {*} count
 * @param {*} params
 */
// update db values on getting new parameter for a url or on increase count of url
const update = (url, count, params) => {
    
    formModel
        .findOneAndUpdate({
            link: url  // find url
        }, {
            link: url,
            count: count,
            params: params
        }, {
            new: true,
            runValidators: true
        })
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            console.log(err);
        })
}

export default update;