const Entry = require("../models/Entry");
const {User} = require("../models/User");

const createEntry = async (req, res ) => {

    const newEntry = new Entry(req.body);
    try{
        const savedEntry = await newEntry.save();

        try{
            const user =await User.findById(savedEntry.author);
            user.entries.push(savedEntry._id);
            await user.save();
        }catch (error) {
            res.status(401).json(error.message);
        }
        res.status(200).json(savedEntry);
    }catch(error) {
        res.status(401).json(error.message);
    }
};

const updateEntry = async (req, res) => {

    try{
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true});
        res.status(200).json(updatedEntry);
    }catch (error) {
        res.status(401).json(error.message);
    }
};

const deleteEntry = async (req, res ) => {
    try{
        await Entry.findByIdAndDelete(req.params.id);
        
        try{
            await User.findOneAndUpdate(
                {entries: req.params.id},
                {$pull: {entries: req.params.id}},
                {new : true},
            );
        }catch (error) {
            res.status(400).json(error.message);
        }
        res.status(200).json("The Entry has been deleted");
    }catch (error) {
        res.status(401).json(error.message);
    }
};

const getEntries = async (req, res) => {
    const userId = req.params.userId;
    try{
        const user = await User.findById(userId).populate('entries').exec()
        res.status(200).json(user.entries);
    }catch(error) {
        res.status(401).json(error.message);
    }
};

const getEntry = async (req, res) => {
    try{
        const entry  = await Entry.findById(req.params.id);
        res.status(200).json(entry);
    }catch(error) {
        res.status(401).json(error.message);
    }
};

module.exports = { createEntry, updateEntry, deleteEntry, getEntries, getEntry} ;