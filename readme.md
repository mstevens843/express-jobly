# Jobly Backend

This is the Express backend for Jobly, version 2.

To run this:

    node server.js
    
To run the tests:

    jest -i



## Recently Added Features and Changes

### 1. Adding Job Model, Routes, and Tests
- **Job Model:**
    - Created model for jobs, using same pattern as company model. 
    - Added validation for incoming data to ensure proper jobe creation and updates.
    - Jobs can be created, updated, deleted by admins only. 

- **Job Routes:**
    - Added routes for job management with security requirements. 
    - 'GET /jobs': Retrieves list of all jobs. 
    - 'POST /jobs': Allows admin to add new jobs. 
    - 'PATCH /jobs': Allows admins to update job details
    - 'DELETE /jobs/:id': Allows admins to delete a job. 

- **Job Tests:**
    - Wrote tests for job model methods and job routes. 
    - Ensured validation and security measures are functioning as expected. 



### 2. Added Filtering to Job Listings
- **Job Filtering:**
    - Added filtering options to the 'GET /jobs' route. 
    - 'title': Filter jobs by job title (case-insensitive)
    - 'minSalary:' Filter jobs by a minimum salary. 
    - 'hasEquity:' Filter jobs that offer equity if true. 


- **Filtering Tests:**
    - Wrote tests to ensure filtering functionality work as expected. 
    - Ensured correct combination of filters return appropriate results. 


### 3. Displaying Jobs for a Company
- **Company Job Display:**
    - Modified the 'GET /companies/:handle' route to include job information. 
    - Jobs associated with a company are now listed in the response. 
    - Jobs are returned as an array of objects containing job details ('id', 'title', 'salary', 'equity')

- **Company Job Tests:**
- Wrote tests to ensure jobs are correctly included in company details. 
- Verified job details are accurate and match expected output. 


### 4. Job Applications
- **User Job Applications:**
    - Added new 'POST /users/:username/jobs/:id' route.
    - Allows users to apply for jobs, and admins can apply for users. 
    - Response returns '{ applied: jobId }'.

-  **User Job Application Display:**
    - Modified the 'GET /users/:username' route to include job applications
    - Job IDs are returned as an array in the 'jobs' field. 

- **Job Application Tests:**
    - Wrote tests for job application functionality
    - Ensured users can apply for jobs and view their applied jobs. 