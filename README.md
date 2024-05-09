# Spider Wordle

Detailed Instructions for Setting Up AWS RDS, Postgres, and liquibase
Assumptions:

You have already forked the repository.
You are using Visual Studio Code (VSCode).
You are familiar with obtaining access keys and secret keys from AWS.
You have basic knowledge of AWS services and pgAdmin.
Setting Up Terraform for AWS RDS
Install Terraform by following the instructions (https://learn.hashicorp.com/tutorials/terraform/aws-build?in=terraform/aws-get-started).

Open your terminal and navigate to the Terraform directory in your project by running cd Terraform.

Create a file named secrets.tfvars and add the necessary variables such as db_username and db_password.

Initialize Terraform by running terraform init in the terminal.

Apply the Terraform configuration using the command terraform apply -var-file="secrets.tfvars". This ensures that sensitive variables are not exposed over the internet.

Setting Up pgAdmin
Wait for Terraform to provision the AWS RDS instance. The setup time may vary depending on the instance type.

Once the RDS instance is created successfully, go to the AWS Management Console to capture the endpoint and port of the RDS instance.

Open pgAdmin.

Connect to the pgAdmin using the following credentials:

Server name: Endpoint from AWS
Authentication: pgAdmin Authentication
Login: Username created in secrets.tfvars
Password: Password created in secrets.tfvars
Execute the PostgreSQL script below to create a database named CatHotel:

USE master;
GO

IF DB_ID (N'Spirdle') IS NOT NULL
    ALTER DATABASE Spirdle SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

IF DB_ID (N'Spirdle') IS NOT NULL
    DROP DATABASE Spirdle;
GO

CREATE DATABASE Spirdle;
GO
Setting Up liquibase for Database Migration
Download and install liquibase Desktop from https://www.red-gate.com/products/liquibase/community/download/\

Open your project.

Locate the liquibase.toml file within the liquibase/liquibaseSpirdle/ directory and open it in Visual Studio Code (VSCode).

In liquibase Desktop:
Click on the "+" icon to add a new configuration.
Enter the following details:

ID: SpirdleDB
Display name: Anything you prefer
Driver: Microsoft pgAdmin
Server: Endpoint from AWS
Port: Port from AWS
Database Name: Spirdle
Check "Encrypt" and "Trust Server Certificate"
Authentication: pgAdmin Authentication
Username: Same as in secrets.tfvars
Password: Same as in secrets.tfvars
Click the "Test Connection" button and wait for a green indicator.

Copy the JDBC URL and click "Test" and then "Save".

Go to your GitHub repository and navigate to "Actions".

Go to the repository secrets and add three new secrets:

DB_BUILD_PASSWORD: Same as in secrets.tfvars
DB_BUILD_USERNAME: Same as in secrets.tfvars
DB_BUILD_URL: JDBC URL obtained from liquibase.
ChatGPT
Detailed Instructions for Setting Up AWS RDS, pgAdmin, and liquibase for Spirdle

Assumptions:

You have already forked the repository.
You are using Visual Studio Code (VSCode).
You are familiar with obtaining access keys and secret keys from AWS.
You have basic knowledge of AWS services and pgAdmin.
Setting Up Terraform for AWS RDS

Install Terraform by following the instructions provided here: Terraform AWS Build.
Open your terminal and navigate to the Terraform directory in your project by executing cd Terraform.
Create a file named secrets.tfvars and populate it with necessary variables like db_username and db_password.

Initialize Terraform by running terraform init in the terminal.
Apply the Terraform configuration using the command terraform apply -var-file="secrets.tfvars". This ensures sensitive variables remain protected.
Setting Up pgAdmin

Wait for Terraform to provision the AWS RDS instance. The setup duration may vary based on the instance type.
Once the RDS instance is successfully created, navigate to the AWS Management Console to note down the endpoint and port of the RDS instance.
Open pgAdmin

Connect to the pgAdmin using the following credentials:
Server name: Endpoint from AWS
Authentication: pgAdmin Authentication
Login: Username from secrets.tfvars
Password: Password from secrets.tfvars
Execute the PostgreSQL script below to create a database named Spirdle:
sql
Copy code
USE master;
GO

IF DB_ID (N'Spirdle') IS NOT NULL
    ALTER DATABASE Spirdle SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

IF DB_ID (N'Spirdle') IS NOT NULL
    DROP DATABASE Spirdle;
GO

CREATE DATABASE Spirdle;
GO
Setting Up liquibase for Database Migration

Download and install liquibase Desktop from here.

Open your project.
Find the liquibase.toml file within the liquibase/liquibaseSpirdle/ directory and open it in Visual Studio Code (VSCode).
In liquibase Desktop:
Click on the "+" icon to add a new configuration.
Enter the following details:
ID: SpirdleDB
Display name: Choose any preferred name
Driver: Microsoft pgAdmin
Server: Endpoint from AWS
Port: Port from AWS
Database Name: Spirdle
Check "Encrypt" and "Trust Server Certificate"
Authentication: pgAdmin Authentication
Username: Same as in secrets.tfvars
Password: Same as in secrets.tfvars
Click the "Test Connection" button and await a green indicator.
Copy the JDBC URL, then click "Test" and subsequently "Save".


Navigate to your GitHub repository and access "Actions".
In the repository secrets, add three new secrets:
DB_BUILD_PASSWORD: Same as in secrets.tfvars
DB_BUILD_USERNAME: Same as in secrets.tfvars
DB_BUILD_URL: JDBC URL obtained from liquibase.
