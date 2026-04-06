const users = require('../model/userauthmodel')
const bcrypt = require('bcrypt');
const sendmail = require('../services/nodemailer');
const jwt = require('jsonwebtoken');

const genratetoken = async (_id) => {
    try {

        const user = await users.findById(_id);

        const accesstoken = jwt.sign(
            { _id, "expire": "1h", "role": user.role },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: 60 * 60 }
        )

        const refreshtoken = jwt.sign(
            { _id, "expire": "7h" },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: "7d" }
        )

        user.refreshtoken = refreshtoken;
        user.save();

        return { accesstoken, refreshtoken }

    } catch (error) {
        throw new Error(error.message)
    }
}

const adduser = async (req, res) => {
    try {
        console.log(req.body)
        const { emailphone, password } = req.body;

        const userexists = await users.findOne({ emailphone: emailphone })

        if (userexists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "user already exists"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)
        const otp = Math.floor(1000 + Math.random() * 9000)

        const user = await users.create({ ...req.body, password: hashpassword, otp: otp });

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'registration failed'
            })
        }

        await sendmail(emailphone, 'registration otp', `Your otp is ${otp}`);

        const userdata = await users.findOne({ emailphone: emailphone }).select("-password -otp")

        res.status(200).json({
            success: true,
            data: userdata,
            message: 'registration complete'
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: 'internal server error at registration ' + error.message
        })
    }
}

const verifyuser = async (req, res) => {
    try {

        const { emailphone, otp } = req.body;

        const user = await users.findOne({ emailphone: emailphone, otp: otp })

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'Invalid Email or Otp'
            })
        }

        user.isverify = true;
        await user.save();

        res.status(200).json({
            success: true,
            data: user,
            message: 'registraton complete'
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: 'internal sever error at verify email ' + error.messgae
        })
    }
}

const loginuser = async (req, res) => {
    try {

        const { emailphone, password } = req.body;

        const user = await users.findOne({ emailphone: emailphone });

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'Invalid Email'
            })
        }

        const checkpass = await bcrypt.compare(password, user.password);

        if (!checkpass) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'Invalid Password'
            })
        }

        const { accesstoken, refreshtoken } = await genratetoken(user._id);

        const accoption = {
            httpOnly: true,
            secure: true,
            samesite: null,
            expire: 60 * 60 * 1000
        }

        const refoption = {
            httpOnly: true,
            secure: true,
            samesite: null,
            expire: 60 * 60 * 24 * 7 * 1000
        }

        return res
            .cookie('accesstoken', accesstoken, accoption)
            .cookie('refreshtoken', refreshtoken, refoption)
            .status(200).json({
                success: true,
                data: user,
                message: 'Login sucecssfully'
            })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at login user' + error.message

        })
    }
}

const logoutuser = async (req, res) => {
    try {
        const { _id } = req.body;

        const user = await users.findByIdAndUpdate(
            _id,
            {
                $unset: {
                    refreshtoken: 1
                }
            },
            { new: true }
        )

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'user not logout'
            })
        }

        res
            .clearCookie("accesstoken")
            .clearCookie("refreshtoken")
            .status(200).json({
                success: true,
                data: null,
                message: 'user logout successfully'
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at user logout ' + error.message
        })
    }
}

const genratenewtoken = async (req, res) => {
    try {
        console.log(req.cookies)

        const decodetoken = jwt.verify(req.cookies.refreshtoken, process.env.REFRESH_TOKEN_KEY);
        console.log(decodetoken)

        const user = await users.findById(decodetoken._id);

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'user not found'
            })
        }



        const { accesstoken, refreshtoken } = await genratetoken(user._id);

        const accoption = {
            httpOnly: true,
            secure: true,
            samesite: null,
            expire: 60 * 60 * 1000
        }

        const refoption = {
            httpOnly: true,
            secure: true,
            samesite: null,
            expire: 60 * 60 * 24 * 7 * 1000
        }

        return res
            .cookie('accesstoken', accesstoken, accoption)
            .cookie('refreshtoken', refreshtoken, refoption)
            .status(200).json({
                success: true,
                data: user,
                message: 'token genrate successfully'
            })
    } catch (error) {
        res.status(400).json({
            success: false,
            data: null,
            message: 'internal sever error at new token genrate ' + error.message
        })
    }
}

const checkauth = async (req, res) => {
    try {
        const token = req.cookies.accesstoken || req.header("Authorization")?.replace("Bearer", "");

        if (!token) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'user signout'
            })
        }

        const decodetoken = await jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

        if (!decodetoken) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'token not valid'
            })
        }

        const user = await users.findById(decodetoken._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'user not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: user,
            message: 'authorized user'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at check user' + error.message
        })
    }
}

const forgetpassword = async (req, res) => {
    console.log(req.body)
    try {
        const user = await users.findOne({ emailphone: req.body.emailphone })

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'email is not found'
            })
        }

        const forgetotp = Math.floor(1000 + Math.random() * 9000);
        await sendmail(req.body.emailphone, 'Forget Password OTP', `Your OTP is ${forgetotp}`)

        user.otp = forgetotp;
        await user.save();

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'Forget password not set to user'
            })
        }

        const userdata = await users.findOne({ email: req.body.emailphone }).select("-password -otp")

        res.status(200).json({
            success: true,
            data: userdata,
            message: 'forget otp send'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: 'internal server error at send foget otp' + error.message

        })
    }
}

const resetpassword = async (req, res) => {
    try {
        const { email,otp,password } = req.body;

        const user = await users.findOne({ emailphone: email,opt:otp });

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'user not found by email or OTP not match'
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);

        // if (!user) {
        //     res.status(400).json({
        //         success: false,
        //         data: null,
        //         message: 'Otp is not matched'
        //     })
        // }

        user.password = hashpassword;
        user.save();

        if (!user) {
            res.status(400).json({
                success: false,
                data: null,
                message: 'user password not update'
            })
        }

        const userdata = await users.findOne({ email: email }).select("-password -otp")

        res.status(200).json({
            success: true,
            data: userdata,
            message: 'forget password successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: true,
            data: null,
            message: 'internal sever erorr at forget password ' + error.message
        })
    }
}

module.exports = {
    adduser,
    verifyuser,
    loginuser,
    logoutuser,
    genratenewtoken,
    checkauth,
    forgetpassword,
    resetpassword
}