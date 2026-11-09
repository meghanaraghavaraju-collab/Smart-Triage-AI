# Smart Triage AI – Database Configuration & Schemas

## Database Engine: MongoDB

MongoDB is used for storing unstructured clinical notes, vital time-series data, patient demographics, and staff access credentials.

### Planned Collections
1. **users**: Clinical staff profiles, roles (Nurse, Doctor, Admin), hashed credentials.
2. **patients**: Demographic info, MRN, allergies, pre-existing conditions, emergency contacts.
3. **triage_records**: Comprehensive assessment data, chief complaint, vitals, AI reasoning, triage level (1 to 5 / High, Medium, Low), recommended department, assigned doctor, status.
4. **departments**: Hospital department capacity, bed availability, current wait times.
5. **audit_logs**: Access and triage modification logs for compliance and accountability.
