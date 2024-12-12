#!/bin/bash

# Default parameters
password_file="encryptpdf.creds.txt" # Change accordingly
input_pdf="passwds.creds.pdf" # Change acccordingly
output_pdf="../docs/assets/passwds.creds.pdf"

# Check if the password file exists
if [[ ! -f "$password_file" ]]; then
    echo "Password file '$password_file' not found!"
    exit 1
fi

# Check if the input PDF file exists
if [[ ! -f "$input_pdf" ]]; then
    echo "Input PDF file '$input_pdf' not found!"
    exit 1
fi

# Load the password from the file
password=$(<"$password_file")

# Encrypt the PDF file using the user_pw
pdftk "$input_pdf" output "$output_pdf" user_pw "$password"

if [ $? -eq 0 ]; then
    echo "Successfully encrypted '$input_pdf' as '$output_pdf'."
    rm "$input_pdf"  # Remove the original input file after encryption
else
    echo "Failed to encrypt '$input_pdf'."
fi
