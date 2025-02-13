#!/bin/bash

mysql_user='ebd_user'
mysql_pass='ebd_pass'
mysql_root_pass='mysql_root_pass'
database_name='birdeep'

# check user is root or sudo
echo "Checking if is running as superuser"
if [ "$(id -u)" -ne 0 ]; then
    echo "You need to execute this as sudo"
    exit 1
fi

echo "Installing MariaDB server"
apt update
apt install -y mariadb-server

echo "Starting MariaDB service and enabling auto start"
systemctl start mariadb
systemctl enable mariadb

# Configuracion segura de archivo
echo "Performing initial sql server configuration"
mysql_secure_installation <<EOF

y
$mysql_root_pass
$mysql_root_pass
y
y
y
y
EOF

echo "SQL SERVER STATUS:"
systemctl status mariadb

# Privilegios solo a localhost porque toda interacción con db pasa por API
echo "Creating the database and the API user"
mysql -u root -p"$mysql_root_pass" <<EOF
-- Database creation
CREATE DATABASE IF NOT EXISTS $database_name;
-- User creation
CREATE USER IF NOT EXISTS '$mysql_user'@'localhost' IDENTIFIED BY '$mysql_pass';
-- Grant Privileges
GRANT ALL PRIVILEGES ON $database_name.* TO '$mysql_user'@'localhost';
FLUSH PRIVILEGES;
EOF
echo "Successfully created"