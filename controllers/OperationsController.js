const asynchandler = require('express-async-handler');
const defineUserModel = require('../datamodels/UserModel')
const defineUserDetailsModel = require('../datamodels/UserDetailsModel')
const sequelize = require('../dbconfig/dbconnection');
const User = defineUserModel(sequelize);
const UserDetails = defineUserDetailsModel(sequelize);

const myprofile = asynchandler(async (req, res) => {
    const username = req.user.username;
    const user = await User.findOne({ where: { username } });
    // If user not found, return error
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    res.status(200).json({
        user: {
            username: user.username,
            email: user.email,
            name: user.name
        }
    });
})

const addstudent = asynchandler(
    async (req, res) => {
        const username = req.user.username;
        const user = await User.findOne({ where: { username } });
        // If user not found, return error
        if (!user) {
            res.status(404)
            throw new Error('User not found');
        }
        const {
            rollnumber,
            DOB,
            mobileNumber,
            department,
            lastname,
            firstname,
            college,
            year
        } = req.body;
        
        if (!DOB || !mobileNumber || !department || !lastname || !firstname || !college || !year || !rollnumber) {
            res.status(400);
            throw new Error('All fields are mandatory');
        }
        const containsOnlyLetters = (str) => {
            return /^[a-zA-Z\s]+$/.test(str);
        };
        
        const containsOnlyNumbers = (str) => {
            return /^\d+$/.test(str);
        };

        if (!containsOnlyLetters(firstname)) {
            res.status(400);
            throw new Error('Invaild Firstname');
        }
        if (!containsOnlyLetters(lastname)) {
            res.status(400);
            throw new Error('Invaild Lastname');
        }
        if (!containsOnlyLetters(department)) {
            res.status(400);
            throw new Error('Invaild department');
        }

        if (!containsOnlyLetters(college)) {
            res.status(400);
            throw new Error('Invaild college');
        }
        if (!(containsOnlyNumbers(rollnumber))) {
            res.status(400);
            throw new Error('Invaild rollnumber');
        }
        if (!(containsOnlyNumbers(year))) {
            res.status(400);
            throw new Error('Invaild year');
        }
        if (!(containsOnlyNumbers(mobileNumber))) {
            res.status(400);
            throw new Error('Mobile Number should contain only numbers');
        }
        const isValidDOB = (dob) => {
            // Check if dob is provided and is a string
            if (!dob || typeof dob !== 'string') {
                return false;
            }
        
            // Check if dob matches the format "YYYY-MM-DD"
            const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dobRegex.test(dob)) {
                return false;
            }
        
            // Parse the dob string to create a Date object
            const dobDate = new Date(dob);
        
            // Check if the parsed date is a valid date and year is greater than 1900
            // if (isNaN(dobDate.getTime()) || dobDate.getFullYear() <= 1900) {
            //     return false;
            // }
        
            // Get the current date
            const currentDate = new Date();
        
            // Check if DOB is greater than current date
            if (dobDate > currentDate) {
                return false;
            }
        
            // Calculate the age
            const ageDiff = currentDate - dobDate;
            const ageDate = new Date(ageDiff);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
            // Check if age is at least 15 years
            if (age < 15) {
                return false;
            }
        
            return true;
        };
                

        if (!isValidDOB(DOB)) {
            res.status(400);
            throw new Error('Invaild DOB or Age should above 15 years');
        }
        
        const isValidMobileNumber = (value) => {
            // Check if value is a string
            if (typeof value !== 'string') {
                return false;
            }
            // Remove leading and trailing whitespaces
            const trimmedValue = value.trim();

            // Check if trimmedValue consists of only digits
            return trimmedValue.length === 10;
        };

        if (!isValidMobileNumber(mobileNumber)) {
            res.status(400);
            throw new Error('Mobile number should contain exactly 10 digits');
        }

        const isValidNumber = (value) => {
            return !isNaN(value) && Number.isInteger(value);
        };

        // Check if rollnumber and year are valid numbers
        if (!isValidNumber(parseInt(rollnumber))) {
            res.status(400);
            throw new Error('Invalid roll number');
        }
        if (!isValidNumber(parseInt(year))) {
            res.status(400);
            throw new Error('Invalid year');
        }
        if (!isValidNumber(parseInt(mobileNumber))) {
            res.status(400);
            throw new Error('Invalid Mobile Number');
        }


        const isValidYear = (value) => value >= 1 && value <= 4;
        if (!isValidYear(parseInt(year))) {
            res.status(400);
            throw new Error('Year should be between 1 and 4');
        }
        if(firstname===lastname){
            res.status(400);
            throw new Error('FirstName and Last name should not be same');
        }

        const existingStudent = await UserDetails.findOne({ where: { rollnumber, username } });
        if (existingStudent) {
            res.status(409);
            throw new Error('Roll number already exists');
        }
        const newStudent = await UserDetails.create({
            rollnumber: parseInt(rollnumber),
            username,
            DOB,
            mobileNumber,
            department,
            lastname,
            firstname,
            college,
            year: parseInt(year)
        });
        res.status(200).json({ message: 'Student added successfully', student: newStudent });
    }
)


const getallstudents = asynchandler(async (req, res) => {
    const username = req.user.username;
    const user = await User.findOne({ where: { username } });
    // If user not found, return error
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    const students = await UserDetails.findAll({ where: { username } });
    res.status(200).json({ students });
})


const deletestudent = asynchandler(async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed in the URL params
    const username = req.user.username; // Get the username from the authenticated user

    // Find the student by ID
    const user = await User.findOne({ where: { username } });
    // If user not found, return error
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    const student = await UserDetails.findByPk(id);

    // If student not found, return error
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Check if the student's username matches the request username
    if (student.username !== username) {
        res.status(403);
        throw new Error('Unauthorized: You do not have permission to delete this student');
    }

    // Delete the student
    await student.destroy();

    // Respond with success message
    res.status(200).json({ message: 'Student deleted successfully' });
})

const updatestudent = asynchandler(async (req, res) => {
    const username = req.user.username;
    const user = await User.findOne({ where: { username } });
    // If user not found, return error
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    const { id } = req.params;
    const {
        department,
        year,
        mobileNumber,
        college,
        DOB,
        firstname,
        lastname
    } = req.body;

    // Check if student exists
    const student = await UserDetails.findOne({ where: { id } });
    if (!student) {
        res.status(404)
        throw new Error('Student not found');
    }

    const updatedFields = {};
    const isValidNumber = (value) => {
        return !isNaN(value) && Number.isInteger(value);
    };
    const containsOnlyLetters = (str) => {
        return /^[a-zA-Z\s]+$/.test(str);
    };
    const containsOnlyNumbers = (str) => {
        return /^\d+$/.test(str);
    };
    // Update only the provided fields
    if (department !== undefined && department !== student.department) {
        if (!containsOnlyLetters(department)) {
            res.status(400);
            throw new Error('Invaild department');
        }
        if(department===''){
            res.status(400);
            throw new Error('Empty department');
        }
        updatedFields.department = department;
    }
    else if (department !== undefined) {
        res.status(400)
        throw new Error(`No changes in department`);
    }

    if (year !== undefined && year !== student.year) {
        if(year===''){
            res.status(400);
            throw new Error('Empty department');
        }
        if (!(containsOnlyNumbers(year))) {
            res.status(400);
            throw new Error('Invaild year');
        }
        if (!isValidNumber(parseInt(year))) {
            res.status(400);
            throw new Error('Invalid year');
        }
        const isValidYear = (value) => value >= 1 && value <= 4;
        if (!isValidYear(parseInt(year))) {
            res.status(400);
            throw new Error('Year should be between 1 and 4');
        }
        updatedFields.year = parseInt(year);
    }
    else if (year !== undefined) {
        res.status(400)
        throw new Error(`No changes in year`);
    }

    if (mobileNumber !== undefined && mobileNumber !== student.mobileNumber) {
        if(mobileNumber===''){
            res.status(400);
            throw new Error('Empty MobileNumber');
        }
        if (!(containsOnlyNumbers(mobileNumber))) {
            res.status(400);
            throw new Error('Invaild MobileNumber');
        }
        const isValidMobileNumber = (value) => {
            // Check if value is a string
            if (typeof value !== 'string') {
                return false;
            }
            // Remove leading and trailing whitespaces
            const trimmedValue = value.trim();

            // Check if trimmedValue consists of only digits
            return trimmedValue.length === 10;
        };
        if (!isValidMobileNumber(mobileNumber)) {
            res.status(400);
            throw new Error('Mobile number should contain exactly 10 digits');
        }
        if (!isValidNumber(parseInt(mobileNumber))) {
            res.status(400);
            throw new Error('Invalid MobileNumber');
        }
        updatedFields.mobileNumber = parseInt(mobileNumber);
    }
    else if (mobileNumber !== undefined) {
        res.status(400)
        throw new Error(`No changes in MobileNumber`);
    }

    if (college !== undefined && college !== student.college) {
        if(college===''){
            res.status(400);
            throw new Error('Empty College');
        }
        if (!containsOnlyLetters(college)) {
            res.status(400);
            throw new Error('Invaild college');
        }
        updatedFields.college = college;
    }
    else if (college !== undefined) {
        res.status(400)
        throw new Error(`No changes in college`);
    }

    if (firstname !== undefined && firstname !== student.firstname) {
        if(firstname===''){
            res.status(400);
            throw new Error('Empty FirstName');
        }
        if (!containsOnlyLetters(firstname)) {
            res.status(400);
            throw new Error('Invaild FirstName');
        }
        updatedFields.firstname = firstname;
    }
    else if (firstname !== undefined) {
        res.status(400)
        throw new Error(`No changes in FirstName`);
    }
    if (lastname !== undefined && lastname !== student.lastname) {
        if(lastname===''){
            res.status(400);
            throw new Error('Empty LastName');
        }
        if (!containsOnlyLetters(firstname)) {
            res.status(400);
            throw new Error('Invaild LastName');
        }
        updatedFields.lastname = lastname;
    }
    else if (lastname !== undefined) {
        res.status(400)
        throw new Error(`No changes in LastName`);
    }


    if (DOB !== undefined && DOB !== student.DOB) {
        const isValidDOB = (dob) => {
            // Check if dob is provided and is a string
            if (!dob || typeof dob !== 'string') {
                return false;
            }
        
            // Check if dob matches the format "YYYY-MM-DD"
            const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dobRegex.test(dob)) {
                return false;
            }
        
            // Parse the dob string to create a Date object
            const dobDate = new Date(dob);
        
            // Check if the parsed date is a valid date and year is greater than 1900
            if (isNaN(dobDate.getTime()) || dobDate.getFullYear() <= 1900) {
                return false;
            }
        
            // Get the current date
            const currentDate = new Date();
        
            // Check if DOB is greater than current date
            if (dobDate > currentDate) {
                return false;
            }
        
            // Calculate the age
            const ageDiff = currentDate - dobDate;
            const ageDate = new Date(ageDiff);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
            // Check if age is at least 15 years
            if (age < 15) {
                return false;
            }
        
            return true;
        };
                

        if (!isValidDOB(DOB)) {
            res.status(400);
            throw new Error('Invaild DOB or Age should above 15 years');
        }
        updatedFields.DOB = DOB;
    }
    else if (DOB !== undefined) {
        res.status(400)
        throw new Error(`No changes in DOB`);
    }

     if(firstname !== undefined && lastname !== undefined){
        if(firstname===lastname){
            res.status(400);
            throw new Error('FirstName and Last name should not be same');
        }4
     }
    
    await UserDetails.update(updatedFields, { where: { id } });

    res.status(200).json({ message: 'Student data updated successfully' });

})

module.exports = {
    myprofile,
    addstudent,
    getallstudents,
    deletestudent,
    updatestudent,
};