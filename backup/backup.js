var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (path.extname(file.originalname) !== '.jpg') {
            return cb(null, false)
        }

        cb(null, true)
    }

});





app.post('/profile', upload.single('avatar'), function(req, res) {
    console.log(req.file);
    res.status(204).end();
});
