# Expense Tracker with Neon and Railway

## Project Overview

The **Expense Tracker** is a Node.js API that allows users to manage expenses and users. The project demonstrates **outbound logical replication** between two PostgreSQL databases: **Neon** as the publisher and **Railway** as the subscriber. The replication ensures that data written to Neon is automatically synchronized with the Railway database.

The API supports CRUD (Create, Read, Update, Delete) operations for both expenses and users. The expenses and users are replicated from Neon to Railway, making Railway the source for reading records, while Neon is used for writing operations.

---

## Steps to Set Up the Project Locally

### 1. Clone the Repository
To get started, clone the GitHub repository:
```bash
git clone https://github.com/akhan2000/neon-expense-tracker.git
cd neon-expense-tracker
```

### 2. Set Up Environment Variables
You will need to set the following environment variables in a .env file at the root of the project:


```bash
NEON_HOST=your-neon-host
NEON_DATABASE=your-neon-database
NEON_USER=your-neon-user
NEON_PASSWORD=your-neon-password
NEON_PORT=5432

RAILWAY_HOST=your-railway-host
RAILWAY_DATABASE=your-railway-database
RAILWAY_USER=your-railway-user
RAILWAY_PASSWORD=your-railway-password
RAILWAY_PORT=your-railway-port

```


### 3. Install Dependencies
Install all required dependencies:


```bash
npm install
```
### 4. Run the Application Locally
To run the application locally:

```bash
npm start
This will start the app on http://localhost:3000.
```

### 5. Access Swagger Documentation Locally
Once the app is running, you can access the Swagger UI to test the API endpoints at:

**URL**:[http://localhost:3000/api-docs](http://localhost:3000/api-docs])

---

### Deployed URLs


- **Swagger Documentation**: [https://neon-expense-tracker-production.up.railway.app/api-docs/](https://neon-expense-tracker-production.up.railway.app/api-docs/)

Use the Swagger documentation to test all available API endpoints.

---

### Endpoints to Test

#### Expenses Endpoints

- **GET /api/expenses**: Fetch all expenses from the Railway database.
  - **Description**: Retrieves all expenses stored in the Railway (subscriber) database.
  
- **POST /api/expenses**: Create a new expense in the Neon database.
  - **Description**: Adds a new expense to the Neon (publisher) database.

- **PUT /api/expenses/{id}**: Update an existing expense in the Neon database.
  - **Description**: Updates the details of an existing expense in Neon.

- **DELETE /api/expenses/{id}**: Delete an existing expense from the Neon database.
  - **Description**: Deletes an expense from the Neon database.

#### Users Endpoints

- **GET /api/users**: Fetch all users from the Railway database.
  - **Description**: Retrieves all users stored in the Railway (subscriber) database.
  
- **POST /api/users**: Create a new user in the Neon database.
  - **Description**: Adds a new user to the Neon (publisher) database.

- **PUT /api/users/{id}**: Update an existing user in the Neon database.
  - **Description**: Updates the details of an existing user in Neon.

- **DELETE /api/users/{id}**: Delete an existing user from the Neon database.
  - **Description**: Deletes a user from the Neon database.

---

### Database Configuration

- **Neon Database**: Acts as the **publisher**. All write operations (e.g., creating, updating, deleting expenses and users) are performed on Neon.
- **Railway Database**: Acts as the **subscriber**. All read operations (e.g., fetching expenses and users) are done from Railway, which replicates data from Neon.

#### Replication Setup

- **Logical Replication Slot**: The Neon database has a logical replication slot set up, which streams data changes to the Railway database.
- **Subscription**: Railway is subscribed to the publications from Neon, ensuring that all data changes (inserts, updates, deletes) are replicated in real-time.

---

### How to Verify Replication

#### Testing the Replication via Swagger UI

- **Create Data in Neon**: Use the `POST` endpoint in Swagger to create a new expense or user in Neon. This data should then be automatically replicated to the Railway database.

- **Fetch Data from Railway**: Use the `GET` endpoint to fetch the list of expenses or users from Railway. This will verify that the data created in Neon has been replicated to Railway.

#### Instructions to Verify Replication

1. **POST a new expense** in Neon using the Swagger UI.
2. **GET expenses** from Railway and verify that the new expense appears.
3. **POST a new user** in Neon.
4. **GET users** from Railway and verify that the new user appears.

This confirms that the replication between Neon and Railway is functioning as expected.

# FAQ and Additional Questions

## Latency Question

**Customer Question**:  
“I have two microservices - one in Digital Ocean US East (Ohio), and the other in AWS US West. I've set up the Neon database in us-east-1. Is latency going to be an issue for achieving peak performance given my setup?”

**Response**:  
Latency may indeed be a concern when your services are distributed across multiple regions. The round-trip time (RTT) between US West and US East can introduce around **60-70 ms** of latency. If your application is heavily write-dependent, especially if your AWS US West service frequently interacts with the Neon database in US East, you may experience some performance degradation.

To minimize this latency:
- Consider using **caching mechanisms** near the AWS US West microservice for frequently accessed data.
- If read-heavy operations are expected, explore database **replication** or **geo-distributed databases** to place data closer to the US West service.
- If low-latency, high-performance interaction is critical, you could explore a **multi-region deployment** for your database.

---

## What is Logical Replication in Postgres?

**Logical replication** in Postgres allows selective replication of data changes (inserts, updates, deletes) between databases. Unlike **physical replication**, which replicates the entire database, logical replication works at the table or row level. It is ideal for cases where you need to replicate only specific tables across databases or even filter the data being replicated.

For more information on logical replication, refer to [Neon's Documentation on Logical Replication](https://neon.tech/docs/guides/logical-replication-concepts).

---

## When to Recommend Outbound Logical Replication?

**Outbound logical replication** is recommended when:
- You need to replicate specific tables or data to another database.
- There is a need for **real-time reporting** or **data migration** between different environments.
- You want to keep your **production and analytics databases** synchronized without replicating the entire database.

---

## How to Set Up Outbound Logical Replication from Neon to Railway


Here’s a generic guide for setting up logical replication from Neon to Railway, applicable for most use cases:

### 1. **Enable Logical Replication on Neon**
Before setting up replication, you need to ensure that **logical replication** is enabled on your Neon Postgres instance. You can check this by running:

```bash
SHOW wal_level;
```
Output should be "logical"

#### 2. Create a Publication on Neon
Next, create a publication on the Neon database. A publication is essentially a collection of tables that you want to replicate to the target system (Railway, in this case). You can create a publication for one or more tables by running:

```bash
CREATE PUBLICATION my_publication FOR TABLE my_table;
```
Replace my_publication with the name of your publication, and my_table with the table(s) you want to replicate.

#### 3. Set Up a Logical Replication Slot
A logical replication slot helps ensure data consistency by tracking the state of replication between the publisher (Neon) and the subscriber (Railway). You can create a slot using the following SQL command:

```bash
SELECT * FROM pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

Replace my_replication_slot with a unique name for your replication slot.

#### 4. Create a Subscription on Railway
Now, move to your Railway database and create a subscription that links to the Neon database. The subscription is what allows Railway to pull data from the Neon publication:

```bash
CREATE SUBSCRIPTION my_subscription
CONNECTION 'host=neon-host port=5432 user=your_user password=your_password dbname=your_dbname'
PUBLICATION my_publication;
```
Replace my_subscription with a unique name for your subscription, and ensure that the connection details (host, user, password, etc.) match your Neon database credentials. The my_publication should be the same name you used in step 2.

#### 5. Verify the Setup
Once the subscription is created, you can check if data is being replicated by querying the tables in the Railway database:

```bash
SELECT * FROM my_table;
You should see the replicated data from Neon.
```
