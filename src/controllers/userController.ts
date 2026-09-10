import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js";
import repository from "../data/repository/repository.js";


/* 
//const hashedPassword = await bcrypt.hash("password", 10); //Remove after user db implementation
const hashedPassword = "$2a$10$HN7AR4scRDb2fvtUA7u2DO/C5g0MvgsZ2Q8f.Jp3ZSepfJj0OfFcu"; //password
const hashedAdminPassword = "$2a$10$tb1ZscEiK9ODOc2FYvMHh.i0Xi4Zp4fqa8LYn8jSuFucBBjw.kRkG" //adminPassword

//Remove after user db implementation
export const tempUsers = [{ id: 123, username: "user", passwordHash: hashedPassword, email: "user@testing.com", role: "user" }, { id: 124, username: "admin", passwordHash: hashedAdminPassword, email: "admin@testing.com", role: "admin" }];
*/

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({
            message: "Username and password are required",
        });
        return;
    }

    /*
    const user = tempUsers.find( //Replace with db lookup once user in db is implemented
        (user) => user.username === username
    );
 */
    
    const user = await repository.findByUsername(username)

    if (!user) {
        res.status(401).json({
            message: "Invalid username or password",
        });
        return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        res.status(401).json({
            message: "Invalid username or password",
        });
        return;
    }

    const token = generateToken({
        userId: user.id,
        username: user.username,
        email: user.email
    });

    res.json({
        message: "Login successful",
        username: user.username,
        role: user.role,
        token
    });
}

export const getUserById = async (req: Request, res: Response) => {
    const idRaw = (req.params.id);
    const id = parseInt(idRaw as string)
    if (Number.isNaN(id)) {
        res.status(400).json({
            message: `Requested id ${idRaw} is not a number`
        })
    } else {
        const user = await repository.getUser(id);
        if (!user) {
            res.status(404).json({
                message: `User by the id of ${id} does not exist`
            })
        } else {
            res.json({
                user,
            })
        }

    }
}