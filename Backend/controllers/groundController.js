import Ground from '../models/Ground.js';
import { v2 as cloudinary } from "cloudinary";

export const getAllGrounds = async (req, res) => {
    try {
        const grounds = await Ground.find();

        res.status(200).json({
            success: true,
            count: grounds.length,
            grounds,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch grounds",
            error: error.message,
        });
    }
};

export const createGround = async (req, res) => {
    try {
        console.log(req.file);

        const image = req.file ? req.file.path : "";
        const public_id = req.file ? req.file.filename : "";

        const ground = await Ground.create({ ...req.body, image, public_id, });

        res.status(201).json({
            success: true,
            message: "Ground created successfully",
            ground,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create ground",
            error: error.message,
        });
    }
};

export const getGroundById = async (req, res) => {
    try {
        const ground = await Ground.findById(req.params.id);

        if (!ground) {
            return res.status(404).json({
                success: false,
                message: "Ground not found",
            });
        }

        res.status(200).json({
            success: true,
            ground,
        });


    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch ground",
            error: error.message,
        });
    }
};

export const updateGround = async (req, res) => {
    try {
        const oldGround = await Ground.findById(req.params.id);

        if (!oldGround) {
            return res.status(404).json({
                success: false,
                message: "Ground not found",
            });
        }

        const updateData = { ...req.body };

        if (req.file) {
            if (oldGround.public_id) {
                await cloudinary.uploader.destroy(oldGround.public_id);
            }

            updateData.image = req.file.path;
            updateData.public_id = req.file.filename;
        }

        const ground = await Ground.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Ground updated successfully",
            ground,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update ground",
            error: error.message,
        });
    }
};

export const deleteGround = async (req, res) => {
    try {

        const ground = await Ground.findById(req.params.id);

        if (!ground) {
            return res.status(404).json({
                success: false,
                message: "Ground not found",
            });
        }

        if (ground.public_id) {
            await cloudinary.uploader.destroy(
                ground.public_id
            );
        }

        await Ground.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Ground deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete ground",
            error: error.message,
        });
    }
};
