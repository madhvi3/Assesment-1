This is a Commission Calculator that was developed using the React and .NET on the front and back end respectively. My initial response to the task is that I took time to figure out what had to be done and how both the parts would relate. I also then divided the entire project into smaller segments once I had a solid idea which would be to set up the backend API, create a React UI, process the inputs and validations, format the output, and lastly bind both ends together to allow the flow of calculation to happen smoothly.

I began working on the backend logic in order to ensure that the commission formulas were correct as well as checking the endpoints were responding appropriately. Then I did the frontend, in which I received inputs, simple validation, and ensured that all that was displayed was in the UK currency format. When the preparation was complete, I paid attention to the integration and testing in order to make sure that data was flowing properly between the frontend and the backend.

I also added a minor failover on the frontend- in case the backend dies or breaks, the application will be able to calculate commissions independently and issue a warning instead of failing. This helped in making it more safe and easy.


How to run the app:

⦁	First, go to the backend folder and run dotnet run. If you get a “not secure” warning in the browser, trust the dev certificate so the HTTPS connection works.

⦁	Next, go to the frontend folder, run npm install if its your first time, then npm start to launch the React app.

⦁	Open your browser and go to http://localhost:3000 to see the app.

⦁	You can also check the API docs at https://localhost:5000/swagger to see and test the endpoints directly.


I tested the system with different types of data—normal, large, zero, and even invalid numbers. Everything worked fine, and the UI handled errors gracefully. The results always matched expectations, and formatting stayed consistent.

As far as improvements go, I believe this project has a lot of potential to be enhanced further. We can go as deep as we want—adding better analytics, automation, or even cloud integration—but for now, I’ve completed all the tasks on the checklist and made sure the core system is reliable and ready.

Overall, this project helped me understand how to connect a React frontend with a .NET backend in a clean, structured way. It also improved my approach to planning, testing, and debugging full-stack applications. I really enjoyed building this and hope to work with Avalpha Technologies on more such projects in the future. Thank you for this opportunity!