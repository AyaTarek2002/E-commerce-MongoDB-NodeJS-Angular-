export function catchError(fn) {
    return(req, res) => {
        fn(req, res).catch(err => {
            res.status(400).json({msg: err})
        })
    }
}
