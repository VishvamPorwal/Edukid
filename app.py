#imports
from flask import Flask, render_template, redirect, request, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message

import random
import os
import apod
import guided


app = Flask(__name__)

#db configuration
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///db.sqlite3'

#flask mail config
app.config["MAIL_DEFAULT_SENDER"] = os.getenv('MAIL_DEFAULT_SENDER')
app.config["MAIL_PASSWORD"] = os.getenv('MAIL_PASSWORD')
app.config["MAIL_PORT"] = 587
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv('MAIL_USERNAME')
mail = Mail(app)


db = SQLAlchemy(app)

app.secret_key = os.getenv('secret_key')

space_image = apod.pic_of_day()


#database structure
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    pwd = db.Column(db.String(100))

    def __init__(self, name, email, pwd):
        self.name = name
        self.email = email
        self.pwd = pwd


#guided exercise route
@app.route("/guided_exercises")
def guide():
    #if logged in
    if "name" in session:
        guided_exercise = guided.get_random(random.randint(0,len(guided.pics)-1))
        url = f"http://api.voicerss.org/?key={os.getenv('guided_api_key')}&hl=en-us&src=" + guided_exercise["text"]
        return render_template("guided_exercises.html", url = url, image = guided_exercise["img"], txt = guided_exercise["text"])
    #not logged in yet
    else:
        return redirect(url_for("home"))


#redirect on /home
@app.route("/")
def index():
    return redirect('/home')


#signup route
@app.route("/signup", methods = ["POST", "GET"])
def signup():
    #post method
    if request.method == "POST":
        session.permanent = True
        name = request.form.get("name")
        email = request.form.get("email")
        pwd = request.form.get("psw")
        pwd_rep = request.form.get("psw-repeat")
        if pwd != pwd_rep:                      #if passwords dont match
            flash("Passwords dont match")
            return render_template("signup.html")
        usr = User.query.filter_by(email = email).first()
        if usr is not None:                    #if already registered
            flash("Email already taken")
            return redirect(url_for("signup"))
        user = User(name = name, email = email, pwd = pwd)
        #adding user to database
        db.session.add(user)
        db.session.commit()
        session["name"] = name
        message = Message("You are registered in Edukid! Welcome to Fearning!!", sender = os.getenv('MAIL_DEFAULT_SENDER'), recipients = [email])
        message.body = f"Hello,{session['name']}. We from Edukid welcome you to our family. : )"
        mail.send(message)
        flash("Signup successful!")
        return redirect(url_for("home"))
    #get method
    else:
        return render_template("signup.html")


@app.route("/login", methods = ["POST", "GET"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        pwd = request.form.get("pwd")
        user = User.query.filter_by(email = email).first()
        if user is None:                      #havent registered yet
            flash("You havent registered please sign up!")
            return redirect(url_for("signup"))
        else:
            if user.pwd != pwd:              #password dont match
                flash("Wrong Password")
                return redirect(url_for("login"))
            else:                           #everything is right
                session["name"] = user.name
                return redirect(url_for("home"))
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    if "name" in session:
        name = session["name"]
        session.pop("name", None)
        flash(f"You have been logged out, {name.capitalize()}", "info")
        return redirect(url_for("home"))
    else:
        flash("You havent logged in yet")
        return redirect(url_for("home"))


@app.route("/forgotpwd", methods = ["POST", "GET"])
def forgotpwd():
    if request.method == "GET":
        return render_template("forgot_password.html")
    else:
        email = request.form.get("email")
        session["email"] = email
        usr_found = User.query.filter_by(email = email).first()
        if usr_found is not None:
            flash("otp sent to your email")
            generated_otp = random.randint(1000, 9999)
            session["generated_otp"] = generated_otp
            message = Message("Here is your Otp", sender = 'edukid2021@gmail.com', recipients = [email])
            message.body = f"Your otp is {generated_otp}"
            mail.send(message)
            return redirect(url_for("otp"))
        else:
            flash("Email not found")
            return redirect(url_for("forgotpwd"))


@app.route("/otp", methods = ["POST", "GET"])
def otp():
    if request.method == "POST":
        get_otp = request.form.get("otp")
        get_otp = int(get_otp)
        if session["generated_otp"] == get_otp :
            return redirect(url_for("changepwd"))
        else:
            flash("wrong otp")
            return redirect(url_for("otp"))
    else:
        if 'email' not in session:
            flash("not that easy :)")
            return redirect(url_for("forgotpwd"))
        return render_template("otp.html")


@app.route("/changepwd", methods = ["POST", "GET"])
def changepwd():
    if request.method == "POST":
        usr_found = User.query.filter_by(email = session["email"]).first()
        new_pwd = request.form.get("newpwd")
        usr_found.pwd = new_pwd
        db.session.commit()
        flash("password updated, please login again")
        session.pop("email", None)
        session.pop("generated_otp", None)
        return redirect(url_for("login"))
    else:
        if 'email' not in session:
            flash("seriously who do you think i am kid, bazinga!!")
            return redirect(url_for("forgotpwd"))
        return render_template("changepwd.html")


# @app.route('/layout')
# def layout():
#     return render_template('layout.html')


@app.route("/home")
def home():
    if "name" in session:
        return render_template("home.html",name = session["name"], space_image = space_image, loggedin = True)
    else:
        flash("You havent logged in yet")
        return render_template("home.html", name = "Kid", loggedin = False, space_image = space_image)


@app.route("/aboutus")
def aboutus():
    if "name" in session:
        return render_template("aboutus.html", loggedin = True)
    else:
        return render_template("aboutus.html", loggedin = False)


@app.route("/quiz")
def quiz():
    if "name" in session:
        return render_template("speech.html", loggedin = True)
    else:
        return redirect(url_for("home"))



@app.route("/videos")
def videos():
    if "name" in session:
        return render_template("videos.html", loggedin = True)
    else:
        return redirect(url_for("home"))


@app.route("/games")
def games():
    if "name" in session:
        return render_template("games.html", loggedin = True)
    else:
        return redirect(url_for("home"))



@app.route("/page1")
def page1():
    if "name" in session:
        return render_template("page1.html", loggedin = True)
    else:
        return redirect(url_for("home"))


@app.route("/page2")
def page2():
    if "name" in session:
        return render_template("page2.html", loggedin = True)
    else:
        return redirect(url_for("home"))


@app.route("/page3")
def page3():
    if "name" in session:
        return render_template("page3.html", loggedin = True)
    else:
        return redirect(url_for("home"))





if __name__== "__main__":
    db.create_all()
    app.run(debug=True)


