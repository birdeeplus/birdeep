#!/bin/bash

user="API_user"
pass="user_pass"
media_directory_path="/path/to/audio_data"
conda_group="group"

# ######## USER CREATION ########

echo "Creating new user"

# check user is root or sudo
echo "Checking if is running as superuser"
if [ "$(id -u)" -ne 0 ]; then
    echo "You need to execute this as sudo"
    exit 1
fi

# check if username exists
echo "Checking if user exists"
if id "$user" &>/dev/null; then
    echo "User already exists"
    exit 1
fi

# creates user
echo "Creating user"
useradd -m -s /usr/bin/bash "$user"
echo "User successfully created"
passwd "$user"<<EOF
$pass
$pass
EOF

# ########### DIRECTORY CREATION ############
echo "Creating the data storage directory for the API"
if [ ! -d "$media_directory_path" ]; then
    mkdir -p "$media_directory_path"
    echo "Created the directory"
fi

echo "Granting permissions to user"
chown "$user:$user" "$media_directory_path"
chmod 755 "$media_directory_path"
echo "Permissions granted"

# ############# GROUP AGGREGATION ############
# It aggregates the user to the group associated with conda
# You should execute the following lines from the user:
# /path/to/bin/conda init bash
# exec bash
usermod -aG "$conda_group" "$user"