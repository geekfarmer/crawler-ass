import formModel from '../models/linkSchema';
import update from './updateData'

/**
 *
 *
 * @param {*} url
 * @param {*} count
 * @param {*} params
 */
// create db values on getting new(unique) url
const create = (url, count, params) => {

    let createData = new formModel({
        link: url,
        count: count,
        params: params,
        date: Date.now()
    })

    createData.save()
        .then(doc => {
            // console.log(doc);
            return doc;
        })
        .catch(err => {
            // if already in db update value {count} {params}
            // console.log('Value Updated');
            update(url, count, params)
        })
}

export default create;