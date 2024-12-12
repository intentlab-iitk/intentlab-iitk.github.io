# Websites Repo

This repo contains code base for intentlab's website.

## Ngnix Servre setup

- **Install:** Update system and install nginx using below command
   ```bash
   sudo apt update && sudo apt install nginx -y
   ```

- **Start nginx:** Enable and start nginx using below command
   ```bash
   sudo systemctl enable nginx && sudo systemctl start nginx
   ```

-  **Allow in firewall:** If you're using UFW, allow Nginx traffic
   ```bash
   sudo ufw allow 'Nginx Full'
   ```

-  **Set nginx config:**  
   - Copy pre-configured conf file and update php-fpm version in LabSite.conf
      ```bash
      sudo cp configs/LabSite.conf /etc/nginx/sites-available
      sudo chmod +x configs/update-phpv.sh && sudo configs/update-phpv.sh
      ```

   - Remove the default soft link and create new soft link
      ```bash
      sudo rm /etc/nginx/sites-enabled/default
      sudo ln -s /etc/nginx/sites-available/LabSite.conf /etc/nginx/sites-enabled
      ```

- **Restart nginx:** Check the conf and restart the ngnix
   ```bash
   sudo nginx -t && sudo systemctl restart nginx
   ```

## MySQL Server setup

- **Step 1:** Update and install

   ```bash
   sudo apt update && sudo apt install mysql-server -y
   ```

- **Step 2:** Enable and start MySQL Service

   ```bash
   sudo systemctl enable mysql && sudo systemctl start mysql
   ```

- **Step 3:** Secure MySQL Installation

   - Follow the prompts to configure security settings, such as setting a root password, removing anonymous users, and disallowing remote root login.

      ```bash
      sudo mysql_secure_installation
      ```
   - Sometime mysql_secure_installation skips setup of root user password. Then use below

      ```bash
      sudo mysql
      ```
      ```sql
      ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'mysql_root_password';
      FLUSH PRIVILEGES;
      QUIT;
      ```

- **Step 4:** Log in to MySQL

   ```bash
   mysql -u root -p
   ```

- **Step 5:** Create a Remote Login admin user (SQL Instructions)

   ```sql
   CREATE USER 'admin'@'%' IDENTIFIED BY 'admin_password';
   GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   QUIT;
   ```

   Replace `admin` with the desired username and `admin_password` with the desired password.

- **Step 6:** Configure MySQL to Allow Remote Connections

   ```bash
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
   ```

   Find the line that begins with `bind-address` and change the value from `127.0.0.1` to `0.0.0.0`.

- **Step 7:** Restart MySQL Service

   ```bash
   sudo systemctl restart mysql
   ```

- **Step 8:**: Setup database

   ```bash
   mysql -u root -p -e "CREATE DATABASE intentdb;"
   mysql -u root -p intentdb < configs/intentdb.sql
   ```
   The default password is set as `1234`.

# Instructions for encrypted pdf

To generate a PDF from a LaTeX file in Linux, you can use the `pdflatex` command. Here's how:

1. **Install TeX Distribution** (if not already installed):
   - For Ubuntu/Debian:

     ```bash
     sudo apt update
     sudo apt install texlive-latex-base texlive-latex-extra texlive-fonts-recommended pdftk
     ```


2. **Compile the LaTeX File**:
   - Navigate to the creds and compile pdf

     ```bash
     cd creds
     pdflatex passwds.creds.tex
     ```  

   - Inside creds itself run encryptpdf script and exit back

     ```bash
     sudo chmod +x encryptpdf.sh && sudo ./encryptpdf.sh
     cd ..
     ```



