const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { User } = require("./config");
const notifier = require('node-notifier');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login_mysql");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/products", (req, res) => {
    res.render("product");
});

app.get("/service", (req, res) => {
    res.render("service");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/shopping", (req, res) => {
    res.render("shopping");
});

app.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    const existingUser = await User.findOne({ where: { [Sequelize.Op.or]: [{ username: data.username }, { email: data.email }] } });
    if (existingUser) {
        res.send("User already exists. Please choose a different username or email.");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const newUser = await User.create(data);
        console.log(newUser);

        notifier.notify({
            title: 'Signup successfully.',
            message: 'Please log in.',
            icon: path.join(__dirname, 'icon.jpg'),
            sound: true,
            wait: true
        });

        res.render("login");
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ where: { name: req.body.username } });
        if (!user) {
            res.send("Username not found.");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordMatch) {
                res.render("home");
            } else {
                res.send("Wrong password.");
            }
        }
    } catch (error) {
        res.send("Wrong details.");
    }
});

app.post("/products", async (req, res) => {
    try {
        res.render("product");
    } catch {
        res.send("Wrong details.");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
    console.log(`http://localhost:${port}`);
});
