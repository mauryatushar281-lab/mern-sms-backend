const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');

// const adminRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let admin = await Admin.findOne({ email: req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };


// original admin register and login functions are commented out and replaced with simpler versions that do not use bcrypt for hashing passwords. The new versions directly compare the plaintext password, which is not secure for production use.

// const adminRegister = async (req, res) => {
//     try {
//         const admin = new Admin({
//             ...req.body
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             // result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };



// here i started
const adminRegister = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const { name, email, password, schoolName } = req.body;

        if (!name || !email || !password || !schoolName) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedSchoolName = schoolName.trim();

        const existingAdminByEmail = await Admin.findOne({ email: normalizedEmail });
        const existingSchool = await Admin.findOne({ schoolName: normalizedSchoolName });

        if (existingAdminByEmail) {
            return res.status(409).send({ message: 'Email already exists' });
        }

        if (existingSchool) {
            return res.status(409).send({ message: 'School name already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const admin = new Admin({
            name,
            email: normalizedEmail,
            password: hashedPass,
            schoolName: normalizedSchoolName
        });

        let result = await admin.save();

        result.password = undefined;
        
        res.status(201).send(result);

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ message: "Server error" });
//             if (req.body.password === admin.password) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
    }
};



// here i started for admin login without bcrypt

const adminLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Validate input
        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        // ✅ Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // ✅ Find user
        const admin = await Admin.findOne({ email: normalizedEmail });

        if (!admin) {
            return res.status(404).send({ message: "User not found" });
        }

        // ✅ Compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).send({ message: "Invalid password" });
        }

        // ✅ Remove password
        admin.password = undefined;

        res.status(200).send(admin);

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};



const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail };
