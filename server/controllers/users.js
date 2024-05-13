import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a sanitized user object with only necessary information
        const sanitizedUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            picturePath: user.picturePath,
            friends: user.friends,
            location: user.location,
            occupation: user.occupation,
        };

        res.status(200).json(sanitizedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map( 
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );  
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (id === friendId) { 
            return res.status(400).json({ message: "Cannot add yourself as a friend" });
        }
        
        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map( 
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );  

        res.status(200).json(formattedFriends);
    } catch (err) {
        console.error(err.stack); // Log the error for debugging
        res.status(500).json({ message: "Server error" }); // More specific error message based on error type
    }
}
