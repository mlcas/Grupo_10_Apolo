const db = require("../database/models");

const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

let usersController = {
  login: (req, res) => {
    res.render("user/login");
  },
  userProcess: (req, res) => {
    const resultValidations = validationResult(req);

    console.log(resultValidations.errors);
    if (resultValidations.errors.length > 0) {
      return res.render("user/login", {
        errors: resultValidations.mapped(),
        oldData: req.body,
      });
    }
    db.User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((validetEmail) => {
      if (validetEmail) {
        let isOkThePassword = bcryptjs.compareSync(
          req.body.password,
          validetEmail.pass
        );
        console.log(isOkThePassword);
        console.log(req.body.password);
        if (isOkThePassword) {
          req.session.userLogged = validetEmail;
          if (req.body.rememberMe) {
            res.cookie("userEmail", req.body.email, { maxAge: 1000 * 60 * 60 });
          }
          return res.redirect("/user/profile");
        }
      }
      return res.render("user/login", {
        errors: {
          email: {
            msg: "Este email no esta registrado",
          },
        },
        errors: {
          password: {
            msg: "Esta contraseña es incorrecta",
          },
        },
        oldData: req.body,
      });
    });
  },
  // (get) Create - Formulario para crear un usuario
  register: (req, res) => {
    res.render("user/register");
  },
  saveUsers: (req, res) => {
    const resultValidation = validationResult(req);
    console.log(resultValidation.mapped());
    if (resultValidation.errors.length > 0) {
      return res.render("user/register", {
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }
    db.User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((validationEmail) => {
        if (validationEmail) {
          return res.render("user/register", {
            errors: {
              email: {
                msg: "Este email ya esta registrado",
              },
            },
            oldData: req.body,
          });
        }
        db.User.create({
          name: req.body.name,
          lastname: req.body.lastname,
          birthdate: req.body.birthdate,
          email: req.body.email,
          pass: bcryptjs.hashSync(req.body.password, 10),
          role_id: 2,
          avatar: req.file.filename,
          deleted: 0,
        });
        return res.redirect("/user/login");
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  },
  // Traemos el formulario de edicion
  edit: (req, res) => {
    let movieId = req.params.id;
    console.log(movieId);
    db.User.findByPk(movieId).then((user) => {
      return res.render("user/userEdit", {
        user,
      });
    });
  },
  // Actualizamos la informacion del usuario
  userUpdate: async (req, res) => {
    try {
      let editUser = await db.User.findOne({
        where: {
          id: req.params.id,
        },
      });
      await db.User.update(
        {
          ...req.body,
          avatar: req.file ? req.file.filename : editUser.avatar,
          deleted: 0,
        },
        {
          where: { id: req.params.id },
        }
      );
      res.redirect("/user/profile");
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  },
  profile: (req, res) => {
    return res.render("user/profile", {
      user: req.session.userLogged,
    });
  },
  logout: function (req, res) {
    res.clearCookie("userEmail");
    req.session.destroy();
    return res.redirect("/");
  },
};

module.exports = usersController;
