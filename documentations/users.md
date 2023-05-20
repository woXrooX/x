# User Types
Following user types are **Built-In** to the system.
In Database level they fall into one table but I categorized them in two groups:
  - Insiders
  - Outsiders

Feel free to add more user types at `database_name.user_types`

---

## Insiders
#### root
Has No Limit

#### dev
Can Access *(Some Parts Of)* The Site **Code**

#### admin
Can Control *(Some Parts Of)* The Site Through **UI**

---

## Outsiders
#### everyone
Literally Everyone

#### unauthenticated
Users Who Are **Not Logged In**

#### unauthorized
Users Who Are **Logged In** But Not Verified By The Site's Preferred Methods, Approved By The Site Administrators, Or Authorized To Access Certain Resources Or Perform Specific Actions.

#### authorized
Users Who Are **Logged In** And Have Been Verified Through The Site's Preferred Methods, Approved By The Site Administrators, And Granted Access To Certain Resources Or Permission To Perform Specific Actions.

User Authentication, Verification, And Approval Will/May Vary Project To Project.

---

## Plan Owners
- User Must Be An **Authorized User** In Order To Access A Plan
- Plans Vary From Project To Project
- PlanName -> An Authorized User With A Specific Plan Designated As "PlanName"

---

# Explanation: type vs state vs status
- **users.type**: This refers to the type of user, which could be a customer, an administrator, a vendor, or some other category. It is typically a way to categorize users into different groups based on their roles or permissions within a system. For example, you might have different functionality available to an administrator user versus a customer user, so you might want to track the user type in your database to differentiate between them.

- **users.state**: This generally refers to the current state of the user account, such as whether it is active or inactive, suspended, or deleted. It is typically used to track the current status of a user's account and could be used to prevent users from logging in or using the system if their account is suspended or deleted. It is important to note that users.state may not be permanent and can be changed.

- **users.status**: This is similar to users.state in that it describes the current state of the user account. However, users.status is often used to track a user's status in relation to a particular process or action, such as whether their order is pending, processed, or shipped. It can be used to keep track of the progress of a particular task or action that the user is involved in.

---
