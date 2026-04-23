const users = require('../model/userauthmodel')
const bcrypt = require('bcrypt');
const sendmail = require('../services/nodemailer');
const jwt = require('jsonwebtoken');
const sendSMS = require('../services/senssms');

const isEmail = (input) => {
    return input.includes("@")
}

const isPhone = (input) => {
    return /^[0-9]{10}$/.test(input)
}

const genratetoken = async (_id) => {
    try {

        const user = await users.findById(_id);

        const accesstoken = jwt.sign(
            { _id, "role": user.role },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: 60 * 60 }
        )

        const refreshtoken = jwt.sign(
            { _id, "expire": "7h" },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: "7d" }
        )

        user.refreshtoken = refreshtoken;
        await user.save();

        return { accesstoken, refreshtoken }

    } catch (error) {
        throw new Error(error.message)
    }
}

const adduser = async (req, res) => {
    try {
        console.log(req.body)
        const { emailphone, password } = req.body;

        let data = {
            name: req.body.name,
        }

        if (isEmail(emailphone)) {
            data.email = emailphone;
        } else if (isPhone(emailphone)) {
            data.phone = emailphone
        }

        let conditions = [];
        if (data.email) {
            conditions.push({ email: data.email })
        };
        if (data.phone) {
            conditions.push({ phone: data.phone });
        }


        let userexists = await users.findOne(
            {
                $or: conditions
            }
        );

        // if (isEmail(emailphone)) {
        //     console.log("email")
        //     userexists = await users.findOne({ email: emailphone.toLowerCase() });
        // } else if (isPhone(emailphone)) {
        //     console.log("phone")
        //     userexists = await users.findOne({ phone: emailphone });
        // }
        // console.log(userexists)

        // const userexists = await users.findOne({ emailphone: emailphone })

        if (userexists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "user already exists"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)
        const otp = Math.floor(1000 + Math.random() * 9000)

        const user = await users.create({ ...data, password: hashpassword, otp: otp });

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: 'registration failed'
            })
        }

        if (isEmail(emailphone)) {
            await sendmail(emailphone, 'registration otp', `Your otp is ${otp}`);
        } else if (isPhone(emailphone)) {
            sendSMS(emailphone, otp)
        }

        const userdata = await users.findOne({ emailphone: emailphone }).select("-password -otp")

        res.status(200).json({
            success: true,
            data: userdata,
            message: 'signup complete'
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

        let user = '';
        let data = ''

        if (isEmail(emailphone)) {
            user = await users.findOne({ email: emailphone, otp: otp });
            data = 'email'
        } else if (isPhone(emailphone)) {
            user = await users.findOne({ phone: emailphone, otp: otp })
            data = 'phone'
        }



        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: `Invalid ${data} or Otp`
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
        let user = '';
        let data = ''

        if (isEmail(emailphone)) {
            user = await users.findOne({ email: emailphone });
            data = 'email'
        } else if (isPhone(emailphone)) {
            user = await users.findOne({ phone: emailphone })
            data = 'phone'
        }

        //const user = await users.findOne({ emailphone: emailphone });

        if (!user) {
            return res.status(400).json({
                success: false,
                data: [],
                message: `Invalid email`
            })
        }

        const checkpass = await bcrypt.compare(password, user.password);

        if (!checkpass) {
            return res.status(400).json({
                success: false,
                data:null,
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
        console.log(req.body)
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

        const refreshToken = req.cookies.refreshtoken;

        // ✅ 1. Check if token exists
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'refresh token missing'
            });
        }

        let decodetoken;

        // ✅ 2. Catch jwt.verify error
        try {
            decodetoken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'refresh token invalid or expired'
            });
        }
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
        res.status(500).json({
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
            return res.status(401).json({
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

    let user = '';
    let data = '';

    try {
        if (isEmail(req.body.emailphone)) {
            user = await users.findOne({ email: req.body.emailphone });
            data = 'email'
        } else if (isPhone(req.body.emailphone)) {
            user = await users.findOne({ phone: req.body.emailphone })
            data = 'phone'
        }
        // const user = await users.findOne({ emailphone: req.body.emailphone })

        if (!user) {
            res.status(400).json({
                success: false,
                data: [],
                message: `${data} is not found`
            })
        }

        const forgetotp = Math.floor(1000 + Math.random() * 9000);
        // await sendmail(req.body.emailphone, 'Forget Password OTP', `Your OTP is ${forgetotp}`)

        if (isEmail(req.body.emailphone)) {
            await sendmail(req.body.emailphone, 'Forget Password OTP', `Your otp is ${forgetotp}`);
        } else if (isPhone(req.body.emailphone)) {
            sendSMS(req.body.emailphone, forgetotp)
        }

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
    console.log(req.body)
    try {
        const { emailphone, otp, password } = req.body;

        let user = ''
        let data = ''

        if (isEmail(emailphone)) {
            user = await users.findOne({ email: emailphone, otp: Number(otp) });
            data = 'email'
        } else if (isPhone(emailphone)) {
            user = await users.findOne({ phone: emailphone, otp: Number(otp) })
            data = 'phone'
        }

        //const user = await users.findOne({ emailphone: emailphone, otp: Number(otp) });

        if (!user) {
            return res.status(400).json({
                success: false,
                data: [],
                message: ` user not found by ${data} or OTP not match`
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

        // if (!user) {
        //     res.status(400).json({
        //         success: false,
        //         data: null,
        //         message: 'user password not update'
        //     })
        // }

        let userdata = ''
        if (isEmail(emailphone)) {
            userdata = await users.findOne({ email: emailphone }).select("-password -otp");
        } else if (isPhone(emailphone)) {
            userdata = await users.findOne({ phone: emailphone }).select("-password -otp");
        }

        //const userdata = await users.findOne({ emailphone: emailphone }).select("-password -otp")

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

const getuser = async (req, res) => {
    try {

        const userdata = await users.findById(req.params.id)

        if (!userdata) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'users not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: userdata,
            message: 'users  found'
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at users found ' + error.message
        })
    }
}

const edituser = async (req, res) => {
    try {

        const finduser = await users.findById(req.params.id)
        console.log(finduser)
        console.log(req.body, finduser)

        let updatdata = { ...req.body }

        if (req.body.oldpassword && req.body.oldpassword.trim() !== "") {
            const checkpass = await bcrypt.compare(req.body.oldpassword, finduser.password);


            if (!checkpass) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: 'cuurent password not match'
                })
            }

            const hashpassword = await bcrypt.hash(req.body.password, 10)
            updatdata = { ...req.body, password: hashpassword }
        }




        const useredit = await users.findByIdAndUpdate(
            req.params.id,
            updatdata,
            { new: true, runValidators: true }
        )

        if (!useredit) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'data not edit'
            })
        }

        return res.status(200).json({
            success: true,
            data: useredit,
            message: 'your data edit successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at users edit ' + error.message
        })
    }
}

module.exports = {
    adduser,
    verifyuser,
    genratetoken,
    loginuser,
    logoutuser,
    genratenewtoken,
    checkauth,
    forgetpassword,
    resetpassword,
    getuser,
    edituser
}