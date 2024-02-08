# Task Manager Backend

- This project was made using Node.js, Express.js, MongoDB and Twilio API.
- It uses libraries such as node-cron for implementing cron jobs and jsonwebtoken for implementing authentication of users.
- It provides CRUD operations on users, their tasks and sub-tasks.
- It also provides a scheduled cron jobs for voice calling using twilio for users if a task passes its due date and for setting priority of tasks based on their due dates

## Installation

1. Firstly clone the provided repository
  ```plaintext
  https://github.com/AnshAtreja/Task-Manager-Backend-.git
  ```
2. Install the necessary dependencies
   ```plaintext
   npm install
   ```
3. Create a ".env" file in the project directory and mention the following keys
   ```plaintext
   PORT = 3000
   TWILIO_SID = your_twilio_account_sid
   TWILIO_AUTH = your_twilio_auth_token
   MONGO_URI = your_mongo_uri
   ```
4. Run the server using
   ```
   nodemon index.js
   ```

## API Examples

1. Creating User
  - URL
  ```
  http://localhost:3000/api/users/register
  ```
  - Body
  ```json
  {
    "phone_number": "enter_phone_number_with_country_code",
    "priority": 1
  }
  ```
  Note : Please ensure that the provided phone number is available in Verified Caller ID's
  ```plaintext
  https://console.twilio.com/us1/develop/phone-numbers/manage/verified
  ```






