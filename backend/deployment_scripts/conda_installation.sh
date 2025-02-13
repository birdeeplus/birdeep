#!/bin/bash

miniconda_version="latest"
architecture="Linux-x86_64"
install_dir="$HOME/miniconda"

# check user is root or sudo
echo "Checking if is running as superuser"
if [ "$(id -u)" -ne 0 ]; then
    echo "You need to execute this as sudo"
    exit 1
fi

echo "Descargando Miniconda..."
wget https://repo.anaconda.com/miniconda/Miniconda3-$miniconda_version-$architecture.sh -O miniconda_installer.sh

echo "Instalando Miniconda..."
bash miniconda_installer.sh -b -p "$install_dir"

# Añadir el binario de Miniconda al PATH
export PATH="$install_dir/bin:$PATH"

# Borrar el instalador
rm miniconda_installer.sh

echo "Miniconda ha sido instalado correctamente."
echo "Puedes activar el entorno con 'conda activate'."

