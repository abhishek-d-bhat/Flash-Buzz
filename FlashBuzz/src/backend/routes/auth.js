import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();


/* =========================================================
   AUTHENTICATION MIDDLEWARE
========================================================= */

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token =
        authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : null;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
}


/* =========================================================
   REGISTER
========================================================= */

router.post("/register", async (req, res) => {
    try {
        const {
            name,
            business_name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        const [existingUsers] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const [result] = await pool.execute(
            `INSERT INTO users
            (name, business_name, email, password)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                business_name || null,
                email,
                hashedPassword
            ]
        );

        const token = jwt.sign(
            {
                id: result.insertId,
                email: email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            message: "Account created successfully!",
            token: token,
            user: {
                id: result.insertId,
                name: name,
                business_name: business_name || null,
                email: email
            }
        });

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Server error while creating account."
        });
    }
});


/* =========================================================
   LOGIN
========================================================= */

router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const [users] = await pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful!",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                business_name: user.business_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error while logging in."
        });
    }
});


/* =========================================================
   UPDATE PROFILE
========================================================= */

router.put(
    "/profile",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                name,
                business_name
            } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({
                    message: "Name is required."
                });
            }

            const cleanName = name.trim();

            const cleanBusinessName =
                business_name &&
                business_name.trim()
                    ? business_name.trim()
                    : null;

            await pool.execute(
                `UPDATE users
                 SET name = ?, business_name = ?
                 WHERE id = ?`,
                [
                    cleanName,
                    cleanBusinessName,
                    req.user.id
                ]
            );

            const [users] = await pool.execute(
                `SELECT id, name, business_name, email
                 FROM users
                 WHERE id = ?`,
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    message: "User not found."
                });
            }

            res.json({
                message: "Profile updated successfully!",
                user: users[0]
            });

        } catch (error) {
            console.error("Profile update error:", error);

            res.status(500).json({
                message: "Server error while updating profile."
            });
        }
    }
);


export default router;