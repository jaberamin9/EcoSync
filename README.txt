Bug list:

Bug-1:
URL: http://localhost:8000/api/wce
Method: GET
Error: Dashboard shows capacity error when STS manager enters.
Fixed?: Yes
Solution: Handle null values for stsId and vehicleId. This is the main issue.

Bug-2:
Description: Landfill capacity displays negative value.
Fixed?: Yes
Solution: Implement add, delete, and update functionalities for capacity field.


Task list:

Task-1:
Description: Implement UI for single and multi spinners.
Complete: Yes

Task-2:
Description: Implement route selection.
Complete: Yes

Task-3:
Description: Efficient use trucks, based on fuel consumption cost.

Task-4:
Description: reset password when user loged in.

Task-5:
Description: The system should assist finding the required number of trucks to transfer 
             maximum possible waste from the STS to the Landfill. The following parameters can be
             taken into consideration:
               ○ Each truck can have at most 3 trips.
               ○ Trucks should be chosen to first ensure minimum fuel consumption cost,
                 second to ensure minimum number of trucks.

Task-6:
Description: Increase reusability of components wherever possible.