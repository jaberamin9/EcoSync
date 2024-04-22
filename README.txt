Bug list:

Bug-1:
URL: http://localhost:8000/api/wce
Method: GET
Error: Dashboard shows capacity error when STS manager enters.
Solution: Handle null values for stsId and vehicleId. This is the main issue.
Fixed?: Yes

Bug-2:
Description: Landfill capacity displays negative value.
Solution: Implement add, delete, and update functionalities for capacity field with proper condition.
Fixed?: Yes


Task list:

Task-1:
Description: Implement UI for single and multi spinners.
Complete: Yes

Task-2:
Description: Implement route selection.
Solution: Use react-leaflet and leaflet-routing-machine
Complete: Yes

Task-3:
Description: Efficient use trucks, based on fuel consumption cost.
Solution: Calculate the cost per kilometer based on load:
          formulas: C(journey) = C(unloaded) + loaded capacity/total track capacity X (C(loaded) - C(unloaded))
          then sort the track list based on cost per kilometer.
Complete: Yes

Task-4:
Description: The system should assist finding the required number of trucks to transfer 
             maximum possible waste from the STS to the Landfill. The following parameters can be
             taken into consideration:
               ○ Each truck can have at most 3 trips.
               ○ Trucks should be chosen to first ensure minimum fuel consumption cost,
                 second to ensure minimum number of trucks.
Solution: Calculate the average of fuelCostLoaded and trackCapacity (fuelCostLoaded/trackCapacity), then sort them (knapsack)
Example: Total waste = 37
         Fuel Cost Unloaded = 1 , 1 , 1 , 1 , 1 , 1 , 2 , 2 , 2 , 2 , 2 , 1
         Fuel Cost Loaded = 3 , 9 , 2 , 7 , 4 , 8 , 10 , 11 , 8 , 14 , 6 , 1
         Track capacity = 5 , 7 , 3 , 15 , 5 , 7 , 3 , 15 , 5 , 7 , 3 , 15
         average = 0.6 , 1.2 , 0.6 , 0.46 , 0.8 , 1.14 , 3.3 , 0.73 , 1.6 , 2 , 2 , 0.06
         sort: 0.06 , 0.46 , 0.6 , 0.6 , 0.73 , 0.8 , 1.14 , 1.2 , 1.6 , 2 , 2 , 3.3
         w = 15 + 15 + 5 + 2(3-1) = 37
         c = 1 + 7 + 3 + 1.67 [1+(2/3)*(2-1)]
           = 12.67 
Complete: Yes

Task-5:
Description: reset password when user loged in.

Task-6:
Description: Increase reusability of components wherever possible.