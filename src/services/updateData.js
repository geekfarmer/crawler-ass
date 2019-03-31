import formModel from '../models/linkSchema';

const update = (url, count, params) => {
    
    formModel
        .findOneAndUpdate({
            link: url
        }, {
            link: url,
            count: count,
            params: params
        }, {
            new: true,
            runValidators: true
        })
        .then(doc => {
            // console.log(doc);
        })
        .catch(err => {
            console.log(err);
        })
}

export default update;