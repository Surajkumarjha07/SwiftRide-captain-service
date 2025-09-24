👤 Captain Service

This Captain Service is an internal backend service of SwiftRide (Ride-Sharing platform), which is responsible for managing captain information, accepting ride requests, and other captain related tasks.

-----------------------------------------------------------------------------------------------------------------------------------------------

🚀 Features

✅ Profile Management (Create, Update, Delete)  
✅ User Authentication (JWT-based or OAuth)  
✅ Finding nearby captains within 5 km range  
✅ Accept rides, request and accept payments  

-----------------------------------------------------------------------------------------------------------------------------------------------

🛠 Technologies Used

✅ Node.js  
✅ Express  
✅ TypeScript  
✅ MySQL  
✅ Kafka  
✅ Docker  
✅ Redis  
✅ Prisma ORM  

-----------------------------------------------------------------------------------------------------------------------------------------------

✅ Prerequisites

Ensure you have the following installed ->  
Node.js (for JavaScript/TypeScript backend)  
Express  

Required Packages ->  
bcrypt  
jsonwebtoken  
dotenv  
prisma  
nodemon  
tsup (for TypeScript)  
typescript  (for TypeScript)  
concurrently  (for TypeScript)  
ioredis  
kafkajs  
lodash  
geolib  

Database ->  
MySQL  

-----------------------------------------------------------------------------------------------------------------------------------------------

📌 Steps to Run

1️⃣ Clone the repository

git clone https://github.com/Surajkumarjha07/SwiftRide-captain-service.git

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file and configure the following variables ->  

DATABASE_URL=your-database-url  
PORT=your-port-number  
JWT_SECRET=your-jwt-secret  

4️⃣ Run the Application

nodemon index.js

🚀 Your Captain Service is now up and running! 🎉

