const Member = require('../models/memberModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('../config/cloudinary')

exports.newMember = async (req, res) => {
    try {

        let encPass;

        if (req.body.password) {
            encPass = await bcrypt.hash(req.body.password, 10)
            req.body.password = encPass;
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "reboost/members",
            width: "150",
            crop: "scale",
        });

        // console.log(result)

        req.body.image = result.secure_url

        const member = await Member.create(req.body)

        if (!member) {
            return res.status(400).json({
                success: false,
                message: 'Unable to add new member.'
            })
        }

        return res.status(200).json({
            success: true,
            member,
            message: 'New member was added successfully.'
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        })
    }
}


exports.getMember = async (req, res) => {

    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "member not found."
            })
        }

        return res.status(200).json({
            success: true,
            member
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//Update member info
exports.updateMemberInfo = async (req, res) => {

    try {

        const {
            name,
            position,
            email,
            phoneNumber,
            linkedIn,
            instagram,
            reboostEmail,
            github,
        } = req.body;

        const member = await Member.findByIdAndUpdate(req.params.id)

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "member not found."
            })
        }

        if (req.file.path !== "") {
            const image_id = member.image;
            //delete user previous image/avatar
            await cloudinary.uploader.destroy(image_id);

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "reboost/members",
                width: "150",
                crop: "scale",
            });

            member.image = result.secure_url
        }

        member.name = name;
        member.position = position;
        member.email = email;
        member.phoneNumber = phoneNumber;
        member.linkedIn = linkedIn;
        member.instagram = instagram;
        member.reboostEmail = reboostEmail;
        member.github = github;

        await member.save({ validateBeforeSave: true })

        return res.status(200).json({
            success: true,
            message: "Profile update successfully."
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

exports.deleteMember = async (req, res) => {
    try {

        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "member not found."
            })
        }

        const image_id = member.image;
        await cloudinary.uploader.destroy(image_id);

        return res.status(200).json({
            success: true,
            message: "You have successfully deleted a member"
        })

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

exports.allMembers = async (req, res) => {
    try {
        const members = await Member.find({})

        if (!members) {
            return res.status(404).json({
                success: false,
                message: 'Unable to find all members'
            })
        }
        return res.status(200).json({
            success: true,
            totalNumber: members.length,
            members,
        })

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

//admin login
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        const member = await Member.findOne({ email }).select('+password')

        if (!member) {
            return res.status(200).json({
                status: 404,
                success: false,
                message: "invalid credentials"
            })
        }

        if (!(await bcrypt.compare(password, member.password))) {
            return res.status(200).json({
                status: 404,
                success: false,
                message: "invalid credentials!"
            })
        }

        const token = jwt.sign(
            {
                id: member._id,
                position: member.position,
                name: member.name,
            }
            , `${process.env.JWT_SECRET || '$%jwt&^&token$$%key'}`,
            {
                expiresIn: `${process.env.JWT_EXPIRES_TIME || '7d'}`
            }
        )

        return res.status(200).json({
            success: true,
            token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}