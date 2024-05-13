import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // Validate email format
        const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }
        const doesEmailExist = await User.findOne({ email });
        if (doesEmailExist) {
            throw new Error("Email already exists"); 
        }

        // Validate numerical parameters (viewedProfile, impressions)
        if (typeof viewedProfile !== 'number' || viewedProfile < 0 || Number.isNaN(viewedProfile)) {
            return res.status(400).json({ error: "Invalid viewedProfile value." });
        }
        if (typeof impressions !== 'number' || impressions < 0 || Number.isNaN(impressions)) {
            return res.status(400).json({ error: "Invalid impressions value." });
        }

        // Combine multiple spaces and trim extra spaces
        const trimmedPassword = password.replace(/\s+/g, ' ').trim();

        // Verify that user-set passwords are at least 12 characters in length
        if (trimmedPassword.length < 12) {
            return res.status(400).json({ error: "Password must be at least 12 characters long." });
        }

        // Verify that passwords of more than 128 characters are denied
        if (trimmedPassword.length > 128) {
            return res.status(400).json({ error: "Password must not exceed 128 characters." });
        }

        // Verify that any printable Unicode character, including spaces and Emojis, are permitted
        // const printableUnicodeRegex = /^[\u0020-\u007E\u0080-\u00FF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2C60-\u2C7F\u2E80-\u2EFF\u3000-\u303F\uA490-\uA4CF]*$/;
        // if (!printableUnicodeRegex.test(trimmedPassword)) {
        //     return res.status(400).json({ error: "Password contains invalid characters." });
        // }
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(trimmedPassword, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email});

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials."});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch || !user) { 
            return res.status(400).json({ msg: "Invalid credentials."});
        }    
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        
        // const userResponse = {
        //     id: user._id,
        //     email: user.email,
        // };

        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
