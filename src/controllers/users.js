import userModel from '../models/users.js'
import Auth from '../common/auth.js'
import jwt from 'jsonwebtoken';

const signup = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(!user){
            req.body.password = await Auth.hashPassword(req.body.password)
            await userModel.create(req.body)
            res.status(201).send({
                message:"User Created Successfully"
             })
        }
        else
        {
            res.status(400).send({message:`User with ${req.body.email} already exists`})
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const login = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(user)
        {
            let hashCompare = await Auth.hashCompare(req.body.password,user.password)
            if(hashCompare)
            {
                let token = await Auth.createToken({
                    id:user._id,
                    name:user.name,
                    email:user.email,
                })
                let userData = await userModel.findOne({email:req.body.email},{_id:0,password:0,createdAt:0,email:0})
                res.status(200).send({
                    message:"Login Successfull",
                    token,
                    userData
                })
            }
            else
            {
                res.status(400).send({
                    message:`Invalid Password`
                })
            }
        }
        else
        {
            res.status(400).send({
                message:`Account with ${req.body.email} does not exists!`
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find({},{password:0,createdAt:0});
        res.status(200).send({
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId, { password: 0,createdAt: 0 }); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).send({
        message: 'User retrieved successfully',
        user
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




export default {
    signup,
    login,
    getAllUsers,
    getUserById 
}