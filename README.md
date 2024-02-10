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
   TWILIO_NUMBER = your_twilio_phone_number
   MONGO_URI = your_mongo_uri
   ```
4. Run the server using
   ```plaintext
   node index.js
   ```

## API Examples

### 1. Creating User
  - URL
  ```
  http://localhost:3000/api/users/register
  ```
POST Request
  - Body
  ```json
  {
    "phone_number": "enter_phone_number_with_country_code_(string)",
    "priority": 1 
  }
  ```
Prioriy can be 0, 1 or 2
  - Note : Please ensure that the provided phone number is available in Verified Caller ID's
  ```plaintext
  https://console.twilio.com/us1/develop/phone-numbers/manage/verified
  ```
  - This will return an auth token that must be provided in headers of tasks and sub-tasks API's for authentication
  - The auth token expires within an hour, to get a new one just send the request again
    
### 2. Creating a task
  - URL
  ```
  http://localhost:3000/api/tasks/create
  ```
POST Request
  - Body
  ```json
  {
    "title": "example_title_(string)",
    "description": "example_description_(string)",
    "due_date": "2024-02-03"
  }
  ```
  - Note : Please ensure providing the correct auth token as "Authorization" in the headers

### 3. Fetching tasks
  - URL
  ```
  http://localhost:3000/api/tasks/fetch?&page=1&limit=10
  ```
GET Request
The parameters page and limit can be adjusted according to the needs of the user
  - Note : Please ensure providing the correct auth token as "Authorization" in the headers

### 4. Updating a task
  - URL
  ```
  http://localhost:3000/api/tasks/update/<task_id>
  ```
PUT Request
  - Body
  ```json
  {
    "due_date": "2024-03-15",
    "status": "DONE" 
  }
  ```
Status can be "DONE", "TODO" or "IN_PROGRESS"
  - Note : Please ensure providing the correct auth token as "Authorization" in the headers

### 5. Deleting a task ( soft deletion )
  - URL
  ```
  http://localhost:3000/api/tasks/delete/<task_id>
  ```
DELETE Request
  - Note : Please ensure providing the correct auth token as "Authorization" in the headers

### 6. Creating a sub-task
  - URL
  ```
  http://localhost:3000/api/subTasks/create
  ```
POST Request
  - Body
  ```json
  {
  "task_id" : "id_of_task_(string)"
  }
  ```
  - Note : Please ensure providing the correct auth token as "Authorization" in the headers

  







