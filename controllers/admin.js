// const path = require('path');
// const fs = require('fs');

module.exports = function (formidable, group, aws) {
    return {
        //adding all our routes for the admin
        SetRouting: function (router) {
            //route for getting the admin page
            router.get('/dashboard', this.adminPage);
            //route for posting the images or files
            router.post('/uploadFile', aws.Upload.any(), this.uploadFile);
            //
            router.post('/dashboard', this.adminPostPage);
        },
        //define the file to render on the screen
        adminPage: function (req, res) {
            res.render('admin/dashboard');
        },

        adminPostPage: function (req, res) {
            // creating a group object and populating the model by taking the data from the body (dashboard.ejs)
            const newGroup = new group();
            newGroup.name = req.body.group;
            newGroup.country = req.body.country;
            newGroup.image = req.body.upload;
            // saving the new data
            newGroup.save((err) => {
                // rendering the dashboard.ejs file
                res.render('admin/dashboard');
            })
        },
        //this will allows us to save the files locally into the items directory in the project
        uploadFile: function (req, res) {
            const form = new formidable.IncomingForm();
            //form.uploadDir = path.join(__dirname,'../public/items');
            form.on('file', (field, file) => {
                // fs.rename(file.path, path.join(form.uploadDir,file.name),(err)=>{
                //     if(err) throw err;
                //     console.log('file renamed success');
                // })
            });
            form.on('error', (err) => {
                console.log(err)
            });
            form.on('end', () => {
                console.log('file upload is successfull');
            });
            form.parse(req);
        }
    }
}










































