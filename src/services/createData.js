import formModel from '../models/linkSchema';
import update from './updateData'
const create = (url, count, params) => {

    let createData = new formModel({
        link: url,
        count: count,
        params: params,
        date: Date.now()
    })

    createData.save()
        .then(doc => {
            console.log(doc);
            return doc;
        })
        .catch(err => {
            console.log('Value Updated');
            update(url, count, params)
        })
}

export default create;