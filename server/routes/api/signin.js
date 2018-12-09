let Session = require("../../models/UserSession");
let User = require("../../models/User");

module.exports = app => {
  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: "Error: First name cannot be blank."
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: "Error: Last name cannot be bla  nk."
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "Error: Email cannot be blank."
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: Password cannot be blank."
      });
    }

    console.log("here");

    email = email.toLowerCase();

    // Steps:
    // 1. Verify Email doesn't exist
    // 2. Save
    User.find(
      {
        email: email
      },
      (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: false,
            message: "Error: Account already exists."
          });
        }

        // Save the new user
        const newUser = new User();

        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: Server error"
            });
          }
          res.send({
            success: true,
            message: "Signed up"
          });
        });
      }
    );
  });
  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!email) {
      return res.send({
        success: false,
        message: "Error: Email cannot be blank."
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: Password cannot be blank."
      });
    }
    email = email.toLowerCase();

    User.find(
      {
        email: email
      },
      (err, users) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (users.length != 1) {
          return res.send({
            success: false,
            message: "Error: Invalid"
          });
        }
        const user = users[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: "Error: Password is incorrect"
          });
        }
        // otherwise correct user
        let newSession = new Session();
        newSession.userId = user._id.toString();
        newSession.save((err, doc) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: server error"
              // KOMMER ERROR HER
            });
          }
          return res.send({
            success: true,
            message: "Valid sign in",
            token: doc._id
          });
        });
      }
    );
  });
  app.get("/api/account/verify", (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test

    // Verify that the token is a one of a kind and not deleted
    Session.find(
      {
        _id: token,
        isDeleted: false
      },
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (sessions.length != 1) {
          return res.send({
            success: false,
            message: "Error: Invalid"
          });
        } else {
          return res.send({
            success: true,
            message: "Good"
          });
        }
      }
    );
  });
  app.get("/api/account/logout", (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test

    // Verify that the token is a one of a kind and not deleted
    Session.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false
      },
      {
        $set: {
          isDeleted: true
        }
      },
      null,
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        return res.send({
          success: true,
          message: "Good"
        });
      }
    );
  });
};
