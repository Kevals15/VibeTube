// write this code because we normally in frequently talk with database we use async await for late response and for handling error we use try cath so we can create one utility that accept function and put wrapper like try catch or promise on it and return it

const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler()).catch((err) => next(err))
    }
}

// const asyncHandler = (fn) => async (err, req, res, next) => {
//     try {
//         await fn(err, req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

export { asyncHandler }