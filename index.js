const express = require('express');
const fs = require("fs");
const app = express();
const port = 3000;

const data = fs.readFileSync("data.json", 'utf8', (err) => {
    if(err) console.log(err);
});

const courses = JSON.parse(data);

// Logging middleware
const logger = (req, res, next) => {
    const method = req.method;
    const ip = req.ip;
    const hostname = req.hostname;
    const date = new Date();

    console.log(method, ip, hostname, date);
    next();
};

app.use(logger);

app.use(express.json());
  

app.get("/courses", (req, res) => {
    res.json(courses);
})

app.post("/courses", (req, res) => {
    courses.push({
        "id": courses[courses.length-1].id +1,
        "title": req.body.title,
        "credits": req.body.credits
    });
    res.json(courses);

    fs.writeFile('data.json', JSON.stringify(courses), 'UTF-8', (err) => {
        if(err) console.log(err);
    })
})

app.put("/courses/:id", (req, res) => {
    console.log(req.params.id);
    const course = courses.find(course => course.id == req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }
    
    for(let key in req.body){
        course[key] = req.body[key];
    }

    fs.writeFile('data.json', JSON.stringify(courses), 'UTF-8', (err) => {
        if(err) console.log(err);
    })

    res.json(courses);
})

app.delete("/courses/:id", (req, res) => {
    const index = courses.findIndex(course => course.id == req.params.id);

    if (index !== -1) {
        courses.splice(index, 1);
        fs.writeFile('data.json', JSON.stringify(courses), 'UTF-8', (err) => {
            if(err) console.log(err);
        })
    }

    res.json(courses);
})

app.listen(port, () => {
    console.log('server listening');
})